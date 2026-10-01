const { check } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/userModel");

// ==================== Signup ====================

exports.signupValidator = [
  // Name: required, 2-10 chars, auto-generates slug
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2, max: 10 })
    .withMessage("User name must be 2-10 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  // Email: required, valid format, must be unique
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is invalid")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  // Phone: optional, valid EG/SA number, must be unique
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("User phone must be a valid phone number")
    .custom(async (val) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        throw new Error("Phone already exists");
      }
      return true;
    }),

  // Profile image: optional
  check("profileImage")
    .optional()
    .isString()
    .withMessage("User profile image must be a string"),

  // Password: required, min 6 chars
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters"),

  // Confirm password: required, must match
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  validatorMiddleware,
];

// ==================== Login ====================

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is invalid"),

  check("password").notEmpty().withMessage("User password is required"),

  validatorMiddleware,
];

// ==================== Forgot Password ====================

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email"),
  validatorMiddleware,
];

// ==================== Verify Reset Code ====================

exports.verifyResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be 6 digits"),
  validatorMiddleware,
];

// ==================== Reset Password ====================

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password required")
    .isLength({ min: 6, max: 32 })
    .withMessage("Password must be 6-32 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),

  validatorMiddleware,
];