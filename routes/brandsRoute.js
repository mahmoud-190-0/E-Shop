const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController.js");

// Import brand validators
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/Validators/brandValidator.js");

// Import brand controllers
const {
  createBrand,
  getBrand,
  getSpecificBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brandController.js");

// ==================== Routes ====================

// POST /brands        → create a new brand (admin + manager, with image upload)
// GET  /brands        → list all brands (public)
router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand,
  )
  .get(getBrand);

// GET    /brands/:id  → get a specific brand by id (public)
// PUT    /brands/:id  → update a brand (admin + manager, with image upload)
// DELETE /brands/:id  → delete a brand (admin + manager)
router
  .route("/:id")
  .get(getBrandValidator, getSpecificBrand)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand,
  );

module.exports = router;