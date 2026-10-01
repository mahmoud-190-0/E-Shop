const { check, body, param } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const Brand = require("../../models/brandModel"); // ← renamed to PascalCase

// ==================== Create ====================
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Description too long"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ max: 1000000 }) // ← fixed: was max: 32 (probably meant min or a different bound)
    .withMessage("Price too high"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (Number(req.body.price) <= Number(value)) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be an array of strings"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be an array of strings"),

  // Category: must exist
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category found with id: ${categoryId}`),
          );
        }
      }),
    ),

  // Brand: optional, but must exist if provided
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(
            new Error(`No brand found with id: ${brandId}`),
          );
        }
      }),
    ),

  // Subcategories: must all exist AND belong to the chosen category
  check("subcategories")
    .isArray()
    .withMessage("Subcategories must be an array of IDs")
    .custom((subcategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        if (
          result.length < 1 ||
          result.length !== subcategoriesIds.length
        ) {
          return Promise.reject(
            new Error("Invalid subcategory IDs"),
          );
        }
      }),
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = subcategories.map((sc) =>
            sc._id.toString(),
          );

          // Every ID in req.body must exist in the category's subcategories
          const checker = (target, arr) =>
            target.every((v) => arr.includes(v));

          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(
                "Some subcategories do not belong to this category",
              ),
            );
          }
        },
      ),
    ),

  validatorMiddleware,
];

// ==================== Get ====================
exports.getProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];

// ==================== Update ====================
exports.updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  validatorMiddleware,
];

// ==================== Delete ====================
exports.deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
  validatorMiddleware,
];