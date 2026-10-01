const { check, param } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");

// Add Address
exports.addAddressValidator = [
    check("alias")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Alias must be at least 2 characters"),

    check("details")
        .notEmpty()
        .withMessage("Address details required")
        .isLength({ min: 5 })
        .withMessage("Address details too short"),

    check("phone")
        .notEmpty()
        .withMessage("Phone number required")
        .isMobilePhone("ar-EG")
        .withMessage("Invalid Egyptian phone number"),

    check("city")
        .notEmpty()
        .withMessage("City required")
        .isLength({ min: 2 })
        .withMessage("City name too short"),

    check("postalCode")
        .optional()
        .isPostalCode("EG")
        .withMessage("Invalid postal code"),

    validatorMiddleware,
];

// Remove Address
exports.removeAddressValidator = [
    param("addressId")
        .isMongoId()
        .withMessage("Invalid address id"),

    validatorMiddleware,
];

// Update Address
exports.updateAddressValidator = [
    param("addressId")
        .isMongoId()
        .withMessage("Invalid address id"),

    check("alias")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Alias too short"),

    check("details")
        .optional()
        .isLength({ min: 5 })
        .withMessage("Address details too short"),

    check("phone")
        .optional()
        .isMobilePhone("ar-EG")
        .withMessage("Invalid phone number"),

    check("city")
        .optional()
        .isLength({ min: 2 })
        .withMessage("City name too short"),

    check("postalCode")
        .optional()
        .isPostalCode("EG")
        .withMessage("Invalid postal code"),

    validatorMiddleware,
];