const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const {
  isArrayOfEmployeeIds,
  isArrayOfTasks,
  isValidManager,
  isValidClient,
} = require("../../middlewares/customCheck");

exports.getProjectByIdValidator = [
  check("id").isMongoId().withMessage("invalid Project ID format"),
  validatorMiddleware,
];

exports.createProjectValidator = [
  check("name")
    .notEmpty()
    .withMessage("Project must have a name ")
    .isLength({ min: 3 })
    .withMessage("Too short project name")
    .isLength({ max: 32 })
    .withMessage("Too long project name"),
  check("client")
    .notEmpty()
    .withMessage("Project must belong to a client")
    .isMongoId()
    .withMessage("Invalid client ID format")
    .custom(isValidClient),
  check("productionManager")
    .notEmpty()
    .withMessage("Project must have a productionManager")
    .isMongoId()
    .withMessage("Invalid productionManager ID format")
    .custom(isValidManager),
  check("team")
    .isArray({ max: 30 })
    .withMessage("Team members are required and must be an array")
    .custom(isArrayOfEmployeeIds)
    .withMessage(
      "At least one of the team members you provided was not found or was invalid"
    ),
  check("chainOfTasks")
    .isArray({ max: 30 })
    .withMessage("ChainOfTasks must be an array")
    .custom(isArrayOfTasks)
    .optional(),
  validatorMiddleware,
];

exports.updateProjectValidator = [
  check("name")
    .notEmpty()
    .withMessage("Project must have a name ")
    .isLength({ min: 3 })
    .withMessage("Too short project name")
    .isLength({ max: 32 })
    .withMessage("Too long project name"),
  check("client")
    .notEmpty()
    .withMessage("Project must belong to a client")
    .isMongoId()
    .withMessage("Invalid client ID format")
    .custom(isValidClient),
  check("productionManager")
    .notEmpty()
    .withMessage("Project must have a productionManager")
    .isMongoId()
    .withMessage("Invalid productionManager ID format")
    .custom(isValidManager),
  check("team")
    .isArray({ max: 30 })
    .withMessage("Team members are required and must be an array")
    .custom(isArrayOfEmployeeIds)
    .withMessage("At least one ID has an invalid format"),
  check("chainOfTasks")
    .isArray({ max: 30 })
    .withMessage("ChainOfTasks must be an array")
    .custom(isArrayOfTasks)
    .optional(),
  validatorMiddleware,
];

exports.deleteProjectValidator = [
  check("id").isMongoId().withMessage("invalid project ID format"),
  validatorMiddleware,
];
