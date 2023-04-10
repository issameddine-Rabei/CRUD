const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const { isUniqueEmail, isArrayOfProjects } = require("../../middlewares/customCheck");

// Finds the validation errors in this request and wraps them in an object with handy functions

exports.getClientByIdValidator = [
  check("id").isMongoId().withMessage("invalid client ID format"),
  validatorMiddleware,
];

exports.createClientValidator = [
  check("name")
    .notEmpty()
    .withMessage("Client name required")
    .isLength({ min: 3 })
    .withMessage("Too short Client name")
    .isLength({ max: 32 })
    .withMessage("Too long Client name"),
  check("email")
    .notEmpty()
    .withMessage("Email address required")
    .isEmail()
    .withMessage("This field should be a valid email")
    .custom(isUniqueEmail),
  check("phone")
    .notEmpty().withMessage("Phone number required"),
  check("projects")
    .isArray({max: 30}).withMessage("projects must be an array")
    .custom(isArrayOfProjects),
  validatorMiddleware,
];

exports.updateClientValidator = [
  check("id").isMongoId().withMessage("invalid client ID format"),
  validatorMiddleware,
];

exports.deleteClientValidator = [
  check("id").isMongoId().withMessage("invalid client ID format"),
  validatorMiddleware,
];
