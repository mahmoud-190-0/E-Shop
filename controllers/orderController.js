const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const stripe = require("../config/stripe");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");


// @desc    Get dashboard stats (total orders + revenue)
// @route   GET /api/v1/orders/stats
// @access  Private (admin, manager)
exports.getOrderStats = asyncHandler(async (req, res) => {
    const agg = await Order.aggregate([
        // exclude cancelled orders from revenue
        { $match: { status: { $ne: "cancelled" } } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                revenue: {
                    $sum: {
                        $ifNull: ["$totalPriceAfterDiscount", "$totalOrderPrice"],
                    },
                },
            },
        },
    ]);

    const { total = 0, revenue = 0 } = agg[0] || {};

    res.status(200).json({
        status: "success",
        data: { total, revenue: Math.floor(revenue) },
    });
});
// @desc    Create a cash order
// @route   POST /api/v1/orders
// @access  Private (user only)
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    // 1) Get the user's cart, with products populated so we can snapshot them.
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "cartItems.product",
        "title imageCover price quantity",
    );
    if (!cart) {
        return next(new ApiError("Cart not found", 404));
    }

    // 2) Ensure the cart is not empty.
    if (cart.cartItems.length === 0) {
        return next(new ApiError("Cart is empty", 400));
    }

    // 3) Validate stock and build snapshot items (do this BEFORE creating the order).
    const cartItems = cart.cartItems.map((item) => {
        const product = item.product;

        if (!product) {
            // Product was deleted while in cart
            throw new ApiError(
                `A product in your cart no longer exists. Please remove it and try again.`,
                400,
            );
        }

        if (product.quantity < item.quantity) {
            throw new ApiError(
                `Only ${product.quantity} left in stock for "${product.title}"`,
                400,
            );
        }

        return {
            product: product._id,
            name: product.title,
            image: product.imageCover,
            quantity: item.quantity,
            price: item.price,
        };
    });

    // 4) Build the pricing structure.
    const itemsPrice = cart.totalPrice;
    const discount = cart.discountValue || 0;
    const shippingPrice = 0;
    const totalOrderPrice = itemsPrice + shippingPrice;
    const totalPriceAfterDiscount = Math.floor(totalOrderPrice - discount);

    // 5) Create the order with snapshot items.
    const order = await Order.create({
        user: req.user._id,
        cartItems,
        totalOrderPrice,
        totalPriceAfterDiscount,
        paymentMethodType: "cash",
    });

    // 6) Decrease product stock and increase sold counter.
    for (const item of cartItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: {
                quantity: -item.quantity,
                sold: item.quantity,
            },
        });
    }

    // 7) Clear the cart after a successful order.
    cart.cartItems = [];
    cart.totalPrice = 0;
    cart.discountValue = 0;
    cart.coupon = undefined;
    cart.totalPriceAfterDiscount = 0;
    await cart.save();

    // 8) Respond with the created order.
    res.status(201).json({
        status: "success",
        message: "Cash order created successfully",
        data: order,
    });
});
// @desc    Get all orders (admin sees all, user sees only theirs)
// @route   GET /api/v1/orders
// @access  Private (admin and user)
exports.getOrders = asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.user.role === "user") {
        filter = { user: req.user._id };
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        Order.find(filter)
            .populate("user", "name email")
            .populate("cartItems.product", "title price imageCover") // ← add imageCover
            .sort("-createdAt")
            .skip(skip)
            .limit(limit),
        Order.countDocuments(filter),
    ]);

    res.status(200).json({
        status: "success",
        results: orders.length,
        page,
        total,
        data: orders,
    });
});

// @desc    Get a single order by id
// @route   GET /api/v1/orders/:id
// @access  Private (admin and user)
exports.getSpecificOrder = asyncHandler(async (req, res, next) => {
    // 1) Fetch the order and populate related fields.
    const order = await Order.findById(req.params.id)
        .populate("user", "name email")
        .populate("cartItems.product", "title price imageCover");

    // 2) Handle the case where the order does not exist.
    if (!order) {
        return next(new ApiError("Order not found", 404));
    }

    // 3) Authorization: users can only access their own orders.
    if (
        req.user.role === "user" &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        return next(new ApiError("Not authorized to access this order", 403));
    }

    // 4) Respond with the order.
    res.status(200).json({
        status: "success",
        data: order,
    });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (admin only)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    // 1) Find the order by id.
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError("Order not found", 404));
    }

    const newStatus = req.body.status;

    // 2) Validate the requested status is in the allowed list.
    const allowedStatus = [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
    ];
    if (!allowedStatus.includes(newStatus)) {
        return next(new ApiError("Invalid status value", 400));
    }

    // 3) Define valid status transitions per payment method.
    const validTransitions = {
        cash: {
            pending: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: [],
        },
        card: {
            pending: ["paid", "cancelled"],
            paid: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: [],
        },
    };

    // 4) Guard against unknown payment method or current state.
    const method = order.paymentMethodType;
    if (!validTransitions[method] || !validTransitions[method][order.status]) {
        return next(new ApiError("Invalid order state", 400));
    }

    // 5) Reject transitions that aren't allowed from the current status.
    if (!validTransitions[method][order.status].includes(newStatus)) {
        return next(
            new ApiError(
                `Cannot change status from ${order.status} to ${newStatus} for ${method} order`,
                400,
            ),
        );
    }

    // 6) Apply the new status.
    order.status = newStatus;

    // 7) Set timestamps automatically based on the new status.
    if (newStatus === "paid") {
        order.paidAt = Date.now();
    }
    if (newStatus === "delivered") {
        order.deliveredAt = Date.now();
    }

    // 8) Persist and respond.
    await order.save();

    res.status(200).json({
        status: "success",
        message: "Order status updated successfully",
        data: order,
    });
});

// @desc    Cancel an order by the user (atomic: status + stock rollback)
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private (user only)
exports.cancelOrderByUser = asyncHandler(async (req, res, next) => {
    // 1) Start a session + transaction.
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2) Find the order by id (inside the transaction).
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            return next(new ApiError("Order not found", 404));
        }

        // 3) Ensure the user owns this order.
        if (order.user.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return next(new ApiError("Not authorized", 403));
        }

        // 4) Only pending orders can be cancelled by the user.
        if (order.status !== "pending") {
            await session.abortTransaction();
            return next(new ApiError("Order cannot be cancelled now", 400));
        }

        // 5) Mark the order as cancelled.
        order.status = "cancelled";

        // 6) Roll back product stock (restore quantity, decrement sold).
        for (const item of order.cartItems) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        quantity: item.quantity,
                        sold: -item.quantity,
                    },
                },
                { session },
            );
        }

        // 7) Persist the order inside the transaction.
        await order.save({ session });

        // 8) Commit all writes atomically.
        await session.commitTransaction();

        // 9) Respond with the cancelled order.
        res.status(200).json({
            status: "success",
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (err) {
        // 10) Roll back on any error (only if still in a transaction).
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        next(err);
    } finally {
        // 11) Always end the session.
        session.endSession();
    }
});

// @desc    Create a Stripe checkout session
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  Private (user only)
exports.createCheckoutSession = asyncHandler(async (req, res, next) => {
    // 1) App-level pricing config (currently zero).
    const taxPrice = 0;
    const shippingPrice = 0;

    // 2) Get the user's cart.
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.cartItems.length === 0) {
        return next(new ApiError("Cart is empty", 400));
    }

    // 3) Get the shipping address from the request body.
    //    Format: { street, city, postalCode, country, phone }
    const shippingAddress = req.body?.shippingAddress; if (!shippingAddress) {
        return next(new ApiError("Shipping address is required", 400));
    }

    // 4) Compute the price to charge.
    //    Prefer the discounted total when a coupon was applied.
    const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
    const totalPrice = cartPrice + taxPrice + shippingPrice;

    // 5) Stripe expects the smallest currency unit (piasters for EGP).
    const amount = Math.round(totalPrice * 100);
    if (amount <= 0) return next(new ApiError("Invalid order total", 400));

    // 6) Create the Stripe checkout session.
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "egp",
                    product_data: { name: `Order for ${req.user.name}` },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/orders?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        // Use the ACTUAL cart._id, not req.params.cartId (which may be undefined).
        client_reference_id: cart._id.toString(),
        metadata: {
            userId: req.user._id.toString(),
            // Stripe metadata values must be strings, so serialize the address.
            shippingAddress: JSON.stringify(shippingAddress),
        },
    });

    // 7) Respond with the session.
    res.status(200).json({
        status: "success",
        session,
    });
});

// ==================== Helper ====================

// @desc    Convert a completed Stripe session into an Order (atomic + idempotent)
// @access  Internal
const createOrderFromSession = async (session) => {
    // 1) Idempotency guard — Stripe may deliver the same event multiple times.
    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    if (existingOrder) return existingOrder;

    // 2) Load the cart, populated so we can snapshot products.
    const cart = await Cart.findById(session.client_reference_id).populate(
        "cartItems.product",
        "title imageCover",
    );
    if (!cart || cart.cartItems.length === 0) return null;

    // 3) Load the user.
    const user = await User.findOne({ email: session.customer_email });
    if (!user) throw new Error(`No user found for ${session.customer_email}`);

    // 4) Parse the shipping address.
    let shippingAddress;
    try {
        shippingAddress = session.metadata?.shippingAddress
            ? JSON.parse(session.metadata.shippingAddress)
            : undefined;
    } catch {
        throw new Error("Invalid shippingAddress in Stripe metadata");
    }

    const orderPrice = session.amount_total / 100;

    // 5) Build snapshot items — filter out deleted products.
    const cartItems = cart.cartItems
        .filter((item) => item.product) // product still exists
        .map((item) => ({
            product: item.product._id,
            name: item.product.title,
            image: item.product.imageCover,
            quantity: item.quantity,
            price: item.price,
        }));

    if (cartItems.length === 0) {
        throw new Error("All products in cart were removed");
    }

    // 6) Create the order.
    const order = await Order.create({
        user: user._id,
        cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        totalPriceAfterDiscount: orderPrice,
        paidAt: Date.now(),
        paymentMethodType: "card",
        stripeSessionId: session.id,
    });

    // 7) Decrement stock atomically with a guard.
    const bulkOption = cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product, quantity: { $gte: item.quantity } },
            update: {
                $inc: { quantity: -item.quantity, sold: item.quantity },
            },
        },
    }));
    const bulkResult = await Product.bulkWrite(bulkOption);
    if (bulkResult.modifiedCount !== cartItems.length) {
        await Order.findByIdAndDelete(order._id);
        throw new Error("Insufficient stock for one or more items");
    }

    // 8) Clear the cart.
    await Cart.findByIdAndDelete(cart._id);

    return order;
};

// @desc    Handle Stripe webhook for payment confirmation
// @route   POST /api/v1/orders/webhook
// @access  Public (Stripe calls this endpoint)
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            // Create the order (awaited so errors are caught below).
            await createOrderFromSession(event.data.object);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        // Return 500 so Stripe retries on transient failures.
        console.error("Webhook processing failed:", err);
        res.status(500).json({ received: false, error: err.message });
    }
});