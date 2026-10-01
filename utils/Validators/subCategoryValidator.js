const { check, body } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");
//create

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 2 })
    .withMessage("SubCategory name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("SubCategory name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("can not be empty")
    .isMongoId()
    .withMessage("invalid category format"),

  validatorMiddleware,
];

//get
exports.getSubCategoryValidator = [
  check(`id`).isMongoId().withMessage(`invalid parent category id`),
  validatorMiddleware,
];
//get
exports.getSpecificSubCategory = [
  check(`id`).isMongoId().withMessage(`invalid c id`),

  validatorMiddleware,
];

///update
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),
  body(`name`).optional().custom((val, { req }) => {
    req.body.slug = slugify(val, { lower: true });
    return true;
  }),

];

///delete
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id"),

  validatorMiddleware,
];
