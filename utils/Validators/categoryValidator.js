const { check, param } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");

// Create
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("Category name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  check("image").optional().isString().withMessage("image must be a string"),

  validatorMiddleware,
];

// Get
exports.getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];

// Update
exports.updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id"),

  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  validatorMiddleware,
];

// Delete
exports.deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id"),
  validatorMiddleware,
];