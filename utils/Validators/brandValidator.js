const { check, param, body } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");

// Create
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("Brand name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  validatorMiddleware,
];

// Get
exports.getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware,
];

// Update
exports.updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand id"),
  body("name")
    .notEmpty()
    .withMessage("Brand name cannot be empty")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  validatorMiddleware,
];

// Delete
exports.deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand id"),
  validatorMiddleware,
];