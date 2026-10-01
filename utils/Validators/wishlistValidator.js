const { param } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Product = require("../../models/productModel");

// Add a product to the wishlist
exports.addToWishlistValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .custom(async (val) => {
            // Ensure the product actually exists
            const product = await Product.findById(val);
            if (!product) {
                throw new Error("No product found with this ID");
            }
            return true;
        }),
    validatorMiddleware,
];

// Remove a product from the wishlist
exports.removeFromWishlistValidator = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .custom(async (val, { req }) => {
            // 1) Ensure the product exists
            const product = await Product.findById(val);
            if (!product) {
                throw new Error("No product found with this ID");
            }

            // 2) Ensure the product is in the user's wishlist
            const isInWishlist = req.user.wishlist.some(
                (id) => id.toString() === val.toString(),
            );
            if (!isInWishlist) {
                throw new Error("Product not found in your wishlist");
            }

            return true;
        }),
    validatorMiddleware,
];