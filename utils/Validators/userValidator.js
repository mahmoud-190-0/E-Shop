const { check, body, param } = require("express-validator");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const slugify = require("slugify");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

// ==================== Create User Validator ====================

exports.createUserValidator = [
  // Name: required, 2-32 chars, auto-generates slug
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2 })
    .withMessage("User name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be less than 32 characters")
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
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("Email already exists"),
          );
        }
      }),
    ),

  // Phone: optional, valid EG/SA number
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("User phone must be a valid phone number"),

  // Password: required, min 6 chars
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("User password must be at least 6 characters"),

  // Confirm password: required, must match password
  check("confirmPassword")
    .notEmpty()
    .withMessage("User confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  // Role: optional, must be user/manager/admin
  check("role")
    .optional()
    .isIn(["user", "manager", "admin"]) // ← added "manager"
    .withMessage("User role must be 'user', 'manager', or 'admin'"),

  // Profile image: optional, must be a string
  check("profileImage")
    .optional()
    .isString()
    .withMessage("User profile image must be a string"),

  // Active: optional, must be boolean
  check("active")
    .optional()
    .isBoolean()
    .withMessage("User active must be a boolean"),

  validatorMiddleware,
];

// ==================== Get User Validator ====================

exports.getUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),
  validatorMiddleware,
];

// ==================== Update User Validator (admin) ====================

exports.updateUserValidator = [
  // ID from params
  param("id").isMongoId().withMessage("Invalid user id"),

  // Name: optional, 2-32 chars
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("User name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  // Email: optional, valid format, unique (excluding this user)
  check("email")
    .optional()
    .isEmail()
    .withMessage("User email is invalid")
    .custom((val, { req }) =>
      User.findOne({
        email: val,
        _id: { $ne: req.params.id }, // ← fixed: `req` was missing
      }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("Email already used by another user"),
          );
        }
      }),
    ),

  // Phone: optional, valid EG/SA number
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("User phone must be a valid phone number"),

  // Role: optional
  check("role")
    .optional()
    .isIn(["user", "manager", "admin"]) // ← added "manager"
    .withMessage("User role must be 'user', 'manager', or 'admin'"),

  // Profile image: optional
  check("profileImage")
    .optional()
    .isString()
    .withMessage("User profile image must be a string"),

  // Active: optional, only admin can deactivate
  check("active")
    .optional()
    .isBoolean()
    .withMessage("User active must be a boolean")
    .custom((val, { req }) => {
      if (val === false && req.user.role !== "admin") {
        throw new Error("Only admin can deactivate a user");
      }
      return true;
    }),

  validatorMiddleware,
];

// ==================== Change User Password Validator (admin) ====================

exports.changeUserPasswordValidator = [
  // ID: must be a valid Mongo id
  param("id").isMongoId().withMessage("Invalid user id"),

  // New password: required, min 6 chars
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // Confirm password: required, must match new password
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),

  validatorMiddleware,
];

// ==================== Change Logged User Password Validator ====================

exports.changeLoggedUserPasswordValidator = [
  // Current password: required, must match stored password
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user.id).select("+password");
      if (!user) {
        throw new Error("User not found");
      }

      const isCorrect = await bcrypt.compare(val, user.password);
      if (!isCorrect) {
        throw new Error("Current password is incorrect");
      }

      return true;
    }),

  // New password: required, min 6 chars, must differ from current
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),

  // Confirm password: required, must match new password
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Password confirmation does not match new password");
      }
      return true;
    }),

  validatorMiddleware,
];

// ==================== Update Logged User Data Validator ====================

exports.updateLoggedUserDataValidator = [
  // Name: optional
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("User name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("User name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  // Email: optional, valid format, unique (excluding current user)
  check("email")
    .optional()
    .isEmail()
    .withMessage("User email is invalid")
    .custom((val, { req }) =>
      User.findOne({
        email: val,
        _id: { $ne: req.user.id }, // ← fixed: use req.user.id, not req.params.id
      }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("Email already used by another user"),
          );
        }
      }),
    ),

  // Phone: optional, valid EG/SA number
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("User phone must be a valid phone number"),

  // Profile image: optional
  check("profileImage")
    .optional()
    .isString()
    .withMessage("User profile image must be a string"),

  validatorMiddleware,
];

// ==================== Activate / Deactivate User Validator ====================

exports.userIdValidator = [
  param("id").isMongoId().withMessage("Invalid user id"),
  validatorMiddleware,
];