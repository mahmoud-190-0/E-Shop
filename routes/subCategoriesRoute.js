const express = require("express");

// Import subcategory validators
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// Import subcategory controllers
const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setcategoryIdToBody,
  createfillterobject,
} = require("../controllers/subCategoryController.js");

// Import auth controller
const authController = require("../controllers/authController.js");

// Create a new router instance (mergeParams enabled to access parent route params like categoryId)
const router = express.Router({ mergeParams: true });

// ==================== Routes ====================

// Root route "/" (GET, POST)
router
  .route("/")

  // Create a new subcategory (admin and manager only, sets categoryId from params, with validation)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    setcategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )

  // Get all subcategories (with filtering applied, public)
  .get(createfillterobject, getSubCategories);

// Route "/:id" — deals with one subcategory (GET, PUT, DELETE)
router
  .route("/:id")

  // Get a specific subcategory by id (with validation, public)
  .get(getSubCategoryValidator, getSpecificSubCategory)

  // Update a specific subcategory by id (admin and manager only, with validation)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )

  // Delete a specific subcategory by id (admin and manager only, with validation)
  .delete(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;