const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController.js");

// User validators
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  changeLoggedUserPasswordValidator,
  updateLoggedUserDataValidator,
  userIdValidator,
} = require("../utils/Validators/userValidator.js");

// User controllers
const {
  createUser,
  getUsers,
  getSpecificUser,
  updateUser,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  deactivateUser,
  activateUser,
} = require("../controllers/userController.js");

// ==================== Logged-in User Routes ====================
// These MUST come before /:id to avoid being treated as an id

// GET /users/getMe → get the currently logged-in user's data
router.get(
  "/getMe",
  authController.protect,
  getLoggedUserData,
  getSpecificUser,
);

// PUT /users/changeMyPassword → change the logged-in user's password
router.put(
  "/changeMyPassword",
  authController.protect,
  changeLoggedUserPasswordValidator,
  changeLoggedUserPassword,
);

// PUT /users/updateMe → update the logged-in user's data (with image upload)
router.put(
  "/updateMe",
  authController.protect,
  uploadUserImage,
  updateLoggedUserDataValidator,
  resizeUserImage,
  updateLoggedUserData,
);

// DELETE /users/DeleteMe → deactivate the logged-in user's account
router.delete(
  "/DeleteMe",
  authController.protect,
  deleteLoggedUserData,
);

// ==================== Admin Routes ====================

// PUT /users/changePassword/:id → admin changes a specific user's password
router.put(
  "/changePassword/:id",
  authController.protect,               // ← added (was missing!)
  authController.allowedTo("admin"),    // ← added (was missing!)
  changeUserPasswordValidator,
  changeUserPassword,
);

// PUT /users/activate/:id → admin activates a specific user
router.put(
  "/activate/:id",
  authController.protect,
  authController.allowedTo("admin"),
  userIdValidator,
  activateUser,
);

// DELETE /users/deactivate/:id → admin deactivates a specific user
router.delete(
  "/deactivate/:id",
  authController.protect,
  authController.allowedTo("admin"),
  userIdValidator,
  deactivateUser,
);

// ==================== Root Route ====================

// POST /users → create a new user (admin only, with image upload)
// GET  /users → list all users (admin only)
router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,
    createUserValidator,
    resizeUserImage,
    createUser,
  )
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUsers,
  );

// ==================== Dynamic ID Route ====================

// GET /users/:id → get a specific user (admin only)
// PUT /users/:id → update a specific user (admin only, with image upload)
router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUserValidator,   // ← renamed from getUsersValidators
    getSpecificUser,
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,          // ← moved up (must run before validator)
    updateUserValidator,
    resizeUserImage,
    updateUser,
  );

module.exports = router;