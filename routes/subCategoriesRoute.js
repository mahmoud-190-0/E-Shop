const express = require("express");

// Import subcategory validators
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/Validators/subCategoryValidator.js");

// Import subcategory controllers
const {
  createSubCategory,
  getSubCategories,
  getSpecificSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../controllers/subCategoryController.js");

// Import auth controller
const authController = require("../controllers/authController.js");

// Nested products router
const productRouter = require("./productRoute.js");

const router = require("express").Router({ mergeParams: true });

// ==================== Nested Routes ====================

// Mount product router under /:subcategoriesId/product
router.use("/:subcategoryId/products", productRouter);
// ==================== Routes ====================

// Root route "/" (GET, POST)
router
  .route("/")

  // Create a new subcategory (admin and manager only, sets categoryId from params, with validation)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )

  // Get all subcategories (with filtering applied, public)
  .get(createFilterObject, getSubCategories);

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