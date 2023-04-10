const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Finds the validation errors in this request and wraps them in an object with handy functions

exports.getsubUserByIdValidator = [
  check("id").isMongoId().withMessage("invalid subUser ID format"),
  validatorMiddleware,
];

exports.createsubUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubUser name required")
    .isLength({ min: 3 })
    .withMessage("Too short SubUser name")
    .isLength({ max: 32 })
    .withMessage("Too long SubUser name"),
  check("user")
    .notEmpty()
    .withMessage("subUser must belong to a user")
    .isMongoId()
    .withMessage("Invalid subUser ID format"),
  validatorMiddleware,
];

exports.updateClientValidator = [
  check("id").isMongoId().withMessage("invalid SubUser ID format"),
  validatorMiddleware,
];

exports.deleteClientValidator = [
  check("id").isMongoId().withMessage("invalid SubUser ID format"),
  validatorMiddleware,
];
