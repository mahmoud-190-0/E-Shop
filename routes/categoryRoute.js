const express = require("express");

const authController = require("../controllers/authController.js");

// Category validators
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator.js");

// Category controllers
const {
  createCategory,
  getCategory,
  getSpecificCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/categoryController.js");

// Nested subcategories router
const subcategoriesRouter = require("./subCategoriesRoute.js");

const router = express.Router();

// ==================== Nested Routes ====================

// Mount subcategories router under /:categoryId/subcategories
router.use("/:categoryId/subcategories", subcategoriesRouter);

// ==================== Routes ====================

// POST /categories → create a new category (admin + manager, with image upload)
// GET  /categories → list all categories (public)
router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory,
  )
  .get(getCategory);

// GET    /categories/:id → get a specific category (public)
// PUT    /categories/:id → update a category (admin + manager, with image upload)
// DELETE /categories/:id → delete a category (admin + manager)
router
  .route("/:id")
  .get(getCategoryValidator, getSpecificCategory)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory,
  );

module.exports = router;