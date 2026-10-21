const express = require("express");

const authController = require("../controllers/authController.js");

// Product validators
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/Validators/productValidator.js");

// Product controllers
const {
  createProduct,
  getProduct,
  getSpecificProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage, setSubcategoryIdToBody, createFilterObject
} = require("../controllers/productController.js");

const adminOnly = [
  authController.protect,
  authController.allowedTo("admin", "manager"),
];

// Nested reviews router
const reviewRouter = require("./reviewRoute.js");



//
const router = require("express").Router({ mergeParams: true });
// ==================== Nested Routes ====================

// Mount reviews router under /:productId/reviews
router.use("/:productId/reviews", reviewRouter);

// ==================== Routes ====================

router
  .route("/")
  .post(
    adminOnly,
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    setSubcategoryIdToBody,
    createProduct,
  )
  .get(createFilterObject, getProduct);

router
  .route("/:id")
  .get(getProductValidator, getSpecificProduct)
  .put(
    adminOnly,
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct,
  )
  .delete(adminOnly, deleteProductValidator, deleteProduct);

module.exports = router;
