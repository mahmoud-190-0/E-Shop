const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController.js");

const {
    addToWishlist,
    removeFromWishlist,
    getLoggedUserWishlist,
} = require("../controllers/wishlistController.js");

const {
    addToWishlistValidator,
    removeFromWishlistValidator,
} = require("../utils/Validators/wishlistValidator.js");

// ==================== Routes ====================

// GET /wishlist → get the logged-in user's wishlist
router.get(
    "/",
    authController.protect,
    authController.allowedTo("user"),
    getLoggedUserWishlist,
);

// POST   /wishlist/:productId → add a product to the wishlist
// DELETE /wishlist/:productId → remove a product from the wishlist
router
    .route("/:productId")
    .post(
        authController.protect,
        authController.allowedTo("user"),
        addToWishlistValidator,
        addToWishlist,
    )
    .delete(
        authController.protect,
        authController.allowedTo("user"),
        removeFromWishlistValidator,
        removeFromWishlist,
    );

module.exports = router;