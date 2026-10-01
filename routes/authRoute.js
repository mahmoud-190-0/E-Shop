const express = require("express");

const router = express.Router();

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../utils/Validators/authValidator.js");

const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  authLimiter
} = require("../controllers/authController.js");

// ==================== Routes ====================

// POST /auth/signup         → register a new user (with validation)
router.post("/signup", signupValidator, signup);

// POST /auth/login          → log in an existing user (with validation)
router.post("/login", authLimiter, loginValidator, login);

// POST /auth/forgotPassword → request a password reset code by email
router.post("/forgotPassword", authLimiter, forgotPasswordValidator, forgotPassword);

// POST /auth/verifyResetCode → verify the code sent to the user's email
router.post("/verifyResetCode", authLimiter, verifyResetCodeValidator, verifyResetCode);

// PUT  /auth/resetPassword  → reset the password after verification
router.put("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;