const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/ApiError");

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // 1) Get the product to validate it exists and to snapshot its price.
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  // 2) Get the user's cart (if any).
  let cart = await Cart.findOne({ user: req.user._id });

  // 3) If no cart exists, create a new one with this product.
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
    });
  } else {
    // 4) Check if the product already exists in the cart.
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // 4a) Product exists → increase quantity.
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      // 4b) Product not in cart → push a new item.
      cart.cartItems.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
  }

  // 5) Recalculate the total price from scratch.
  cart.totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // 6) Recalculate the discount value and total price after discount.
  cart.totalPriceAfterDiscount = cart.totalPrice - cart.discountValue;
  // 6) Persist the cart.
  await cart.save();

  // 7) Respond with the updated cart.
  res.status(200).json({
    status: "success",
    message: "Added to cart",
    data: cart,
  });
});

// @desc    Get user cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  // 1) Fetch the cart and populate product details.
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product",
  );

  // 2) Handle the case where the user has no cart yet.
  if (!cart) {
    return next(new ApiError("Cart is empty", 404));
  }

  // 3) Return the cart with an item count.
  res.status(200).json({
    status: "success",
    results: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Remove product from cart
// @route   DELETE /api/v1/cart/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // 1) Get the user's cart.
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // 2) Check that the product actually exists in the cart.
  const itemExists = cart.cartItems.some(
    (item) => item.product.toString() === productId,
  );
  if (!itemExists) {
    return next(new ApiError("Product not found in cart", 404));
  }

  // 3) Remove the item from the cart.
  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId,
  );

  // 4) Recalculate the total price.
  cart.totalPrice = cart.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  cart.totalPriceAfterDiscount = cart.totalPrice - cart.discountValue;
  // 5) Persist and respond.
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed successfully",
    data: cart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  // 1) Get the user's cart.
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // 2) Reset all cart fields to their empty state.
  cart.cartItems = [];
  cart.totalPrice = 0;
  cart.totalPriceAfterDiscount = 0;
  cart.coupon = undefined;
  cart.discountValue = 0;

  // 3) Persist and respond.
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});

// ==================== COUPONS ====================

// @desc    Apply a coupon to the cart (atomic transaction)
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private

exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  // 1) Start a session + transaction for atomic cart + coupon updates.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { couponName } = req.body;

    // 2) Get the user's cart (inside the transaction).
    const cart = await Cart.findOne({ user: req.user._id }).session(session);
    if (!cart) return next(new ApiError("Cart not found", 404));

    // 3) Ensure the cart is not empty.
    if (cart.cartItems.length === 0) {
      return next(new ApiError("Cart is empty", 400));
    }

    // 4) Get the coupon (must be active).
    const coupon = await Coupon.findOne({
      name: couponName,
      active: true,
    }).session(session);
    if (!coupon) return next(new ApiError("Invalid coupon", 404));

    // 5) Reject expired coupons.
    if (coupon.expire < Date.now()) {
      return next(new ApiError("Coupon expired", 400));
    }

    // 6) Reject if the user already used this coupon.
    if (coupon.usedBy.includes(req.user._id)) {
      return next(new ApiError("You already used this coupon", 400));
    }

    // 7) Reject if the coupon's usage limit is reached.
    if (coupon.usedCount >= coupon.usageLimit) {
      return next(new ApiError("Coupon usage limit reached", 400));
    }

    // 8) Calculate the discount value.
    const discountValue =
      coupon.discountType === "percentage"
        ? (cart.totalPrice * coupon.discount) / 100
        : coupon.discount;

    // 9) Compute the final price.
    const finalPrice = cart.totalPrice - discountValue;

    // 10) Update the cart with the discount info (inside the transaction).
    cart.discountValue = Math.floor(discountValue);
    cart.coupon = coupon._id;
    cart.totalPriceAfterDiscount = Math.floor(finalPrice);
    await cart.save({ session });

    // 11) Track coupon usage for this user (inside the transaction).
    coupon.usedBy.push(req.user._id);
    coupon.usedCount += 1;
    await coupon.save({ session });

    // 12) Commit both writes atomically.
    await session.commitTransaction();

    // 13) Respond with the discount summary.
    res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      discountValue,
      totalPriceAfterDiscount: finalPrice,
    });
  } catch (err) {
    // 14) Roll back on any error and pass it to the global handler.
    await session.abortTransaction();
    next(err);
  } finally {
    // 15) Always end the session to free resources.
    session.endSession();
  }
});

// @desc    Remove coupon from cart
// @route   DELETE /api/v1/cart/removeCoupon
// @access  Private
exports.removeCouponFromCart = asyncHandler(async (req, res, next) => {
  // 1) Get the user's cart.
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // 2) Reset all coupon-related fields.
  cart.discountValue = 0;
  cart.coupon = undefined;
  cart.totalPriceAfterDiscount = undefined;

  // 3) Persist and respond.
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon removed successfully",
    data: cart,
  });
});
