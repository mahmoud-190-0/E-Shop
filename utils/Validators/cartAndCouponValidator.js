const { check, param } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Coupon = require("../../models/couponModel");

// Add to Cart
exports.addToCartValidator = [
    check("productId")
        .notEmpty()
        .withMessage("ProductId is required")
        .isMongoId()
        .withMessage("Invalid productId format"),

    check("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

    validatorMiddleware,
];

// ==================================== COUPONS ================================

// Apply Coupon
exports.applyCouponValidator = [
    check("couponName")
        .notEmpty()
        .withMessage("couponName is required")
        .isString()
        .withMessage("couponName must be a string"),

    validatorMiddleware,
];

// ========================== Admin =============================

// Create Coupon
exports.createCouponValidator = [
    check("name")
        .notEmpty()
        .withMessage("Coupon name is required")
        .isLength({ min: 3, max: 20 })
        .withMessage("Coupon name must be 3-20 characters")
        .custom(async (val) => {
            const coupon = await Coupon.findOne({ name: val });
            if (coupon) {
                throw new Error("Coupon already exists");
            }
            return true;
        }),

    check("discount")
        .notEmpty()
        .withMessage("Discount is required")
        .isNumeric()
        .withMessage("Discount must be a number"),

    check("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("discountType must be percentage or fixed"),

    check("expire")
        .notEmpty()
        .withMessage("Expire date required")
        .isISO8601()
        .withMessage("Invalid date format"),

    check("usageLimit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("usageLimit must be at least 1"),

    validatorMiddleware,
];

// Update Specific Coupon
exports.updateCouponValidator = [
    param("id").isMongoId().withMessage("Invalid coupon id"),

    check("name")
        .optional()
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be 3-20 characters")
        .custom(async (val, { req }) => {
            const coupon = await Coupon.findOne({ name: val });

            // Reject if a *different* coupon already uses this name
            if (coupon && coupon._id.toString() !== req.params.id) {
                throw new Error("Coupon name already exists");
            }

            return true;
        }),

    check("discount")
        .optional()
        .isNumeric()
        .withMessage("Discount must be a number"),

    check("discountType")
        .optional()
        .isIn(["percentage", "fixed"])
        .withMessage("discountType must be percentage or fixed"),

    check("expire")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),

    check("usageLimit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("usageLimit must be at least 1"),

    validatorMiddleware,
];

// Delete Coupon
exports.deleteCouponValidator = [
    param("id").isMongoId().withMessage("Invalid coupon id"),
    validatorMiddleware,
];
// Get Specific Coupon
exports.getCouponValidator = [
    param("id").isMongoId().withMessage("Invalid coupon id"),
    validatorMiddleware,
];