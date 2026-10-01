const { check, param, body } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

// ==================== Create ====================
exports.createReviewValidator = [
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Review title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Review title must be less than 100 characters"),

  check("ratings")
    .notEmpty()
    .withMessage("Review ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review ratings must be between 1 and 5"),

  check("product").isMongoId().withMessage("Invalid product id").custom(async (val) => {
    const product = await Product.findById(val);
    if (!product) {
      throw new Error("Product not found");
    }
    return true;
  }),

  // Guard against duplicate reviews (one review per user per product)
  // Note: `user` isn't checked here anymore — setProductIdAndUserIdToBody
  //       sets it from the token, so no need to validate it.
  check("product").custom((val, { req }) =>
    Review.findOne({
      user: req.user.id,
      product: val,
    }).then((review) => {
      if (review) {
        return Promise.reject(
          new Error("You have already reviewed this product"),
        );
      }
    }),
  ),

  validatorMiddleware,
];

// ==================== Get ====================
exports.getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),
  validatorMiddleware,
];

// ==================== Update ====================
exports.updateReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("Review not found");
      }

      // Allow admin/manager to update any review
      if (["admin", "manager"].includes(req.user.role)) {
        return true;
      }

      // Regular user must own the review
      const ownerId = review.user._id || review.user;
      if (ownerId.toString() !== req.user._id.toString()) {
        throw new Error("You are not authorized to update this review");
      }

      return true;
    }),

  // Optional: allow updating title and ratings
  check("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Review title must be between 3 and 100 characters"),

  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review ratings must be between 1 and 5"),

  validatorMiddleware,
];

// ==================== Delete ====================
exports.deleteReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("Review not found");
      }

      // Admin and manager can delete any review
      if (["admin", "manager"].includes(req.user.role)) {
        return true;
      }

      // Regular user must own the review
      if (req.user.role === "user") {
        const ownerId = review.user._id || review.user;
        if (ownerId.toString() !== req.user._id.toString()) {
          throw new Error("You are not authorized to delete this review");
        }
      }

      return true;
    }),

  validatorMiddleware,
];