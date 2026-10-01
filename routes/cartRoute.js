const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController.js");

// Controllers
const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    applyCouponToCart,
    removeCouponFromCart,
} = require("../controllers/cartController.js");

// Validators
const {
    addToCartValidator,
    applyCouponValidator,
} = require("../utils/Validators/cartAndCouponValidator.js");

// ================= Shared Middlewares =================
const protect = authController.protect;
const allowedUser = authController.allowedTo("user");

// ================= Coupon Routes =================

// PUT /cart/applyCoupon → apply a coupon to the cart
router.put(
    "/applyCoupon",
    protect,
    allowedUser,
    applyCouponValidator,
    applyCouponToCart,
);

// DELETE /cart/removeCoupon → remove the coupon from the cart
router.delete(
    "/removeCoupon",
    protect,
    allowedUser,
    removeCouponFromCart,
);

// ================= Product in Cart =================

// DELETE /cart/:productId → remove a specific product from the cart
router.delete(
    "/:productId",
    protect,
    allowedUser,
    removeFromCart,
);

// ================= Cart Base Route =================

// GET    /cart → get the user's cart
// POST   /cart → add a product to the cart
// DELETE /cart → clear the entire cart
router
    .route("/")
    .get(protect, allowedUser, getCart)
    .post(protect, allowedUser, addToCartValidator, addToCart)
    .delete(protect, allowedUser, clearCart);

module.exports = router;