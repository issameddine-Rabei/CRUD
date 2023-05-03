const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {
  isUniqueEmail,
  isUniqueUsername,
} = require("../../middlewares/customCheck");

// Finds the validation errors in this request and wraps them in an object with handy functions

exports.getUserByIdValidator = [
  check("id").isMongoId().withMessage("invalid user ID format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage(`User's real name required`)
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .isLength({ max: 32 })
    .withMessage("Too long  name"),
  check("email")
    .notEmpty()
    .withMessage("Email address required")
    .isEmail()
    .withMessage("This field should be a valid email")
    .custom(isUniqueEmail),
  check("username")
    .isString()
    .notEmpty()
    .withMessage("Username required")
    .custom(isUniqueUsername),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("phone")
    .notEmpty().withMessage("Phone number required"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user ID format"),
  check("name")
    .notEmpty()
    .withMessage(`User's real name required`)
    .isLength({ min: 3 })
    .withMessage("Too short  name")
    .isLength({ max: 32 })
    .withMessage("Too long  name"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("This field should be a valid email")
    .custom(isUniqueEmail),
  check("username")
    .notEmpty()
    .withMessage("Username required")
    .custom(isUniqueUsername),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user ID format"),
  validatorMiddleware,
];
