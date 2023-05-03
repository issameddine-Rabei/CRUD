const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const isUniqueField = (model, field) =>
  asyncHandler(async (value) => {
    const query = {};
    query[field] = value;
    const doc = await mongoose.model(model).findOne(query);
    if (doc) {
      return Promise.reject(new ApiError(`${field} already in use`, 401));
    }
    return true;
  });

const isValidDocument = (model, role) =>
  asyncHandler(async (input) => {
    let query;
    if (mongoose.isValidObjectId(input)) {
      query = { _id: input };
    } else {
      query = { name: input };
    }
    const doc = await mongoose.model(model).findOne(query);
    if (!doc) {
      throw new ApiError(`${model} not found`, 404);
    }
    if (role && doc.role !== role) {
      throw new ApiError(`User is not an ${role}`, 401);
    }
    return true;
  });

const isValidArrayOfIDs = (modelName, fieldName) =>
  asyncHandler(async (value) => {
    const invalidIds = value.filter((id) => !mongoose.isValidObjectId(id));
    if (invalidIds.length > 0) {
      throw new ApiError(
        `All the ${fieldName} elements should have a valid ID format `,
        400
      );
    }
    const validationPromises = value.map((id) =>
      isValidDocument(modelName)(id)
    );
    const validationResults = await Promise.all(validationPromises);
    if (validationResults.includes(false)) {
      throw new ApiError(
        `All elements of the ${fieldName} should be valid ${modelName}IDs`,
        404
      );
    }
    return true;
  });

/*const isValidArrayOfDocs = (modelName, fieldName) =>
  asyncHandler(async (value) => {
    if (!value.every((model) => model instanceof mongoose.model(modelName))) {
      throw new ApiError(
        `${fieldName} field must be an array of ${modelName}IDs`,
        400
      );
    }
    const validationPromises = value.map((model) =>
      isValidDocument(modelName)(model._id)
    );
    const validationResults = await Promise.all(validationPromises);
    if (validationResults.includes(false)) {
      throw new ApiError(
        `All elements of the array should be valid ${modelName}s`,
        404
      );
    }
    return true;
  });*/

// user customs

exports.isUniqueEmail = isUniqueField("User", "email");
exports.isUniqueUsername = isUniqueField("User", "username");

//task customs

exports.isValidProject = isValidDocument("Project");
exports.isValidEmployee = isValidDocument("User", "Employee");
exports.isValidMachine = isValidDocument("Machine");

//client customs
exports.isArrayOfProjects = isValidArrayOfIDs("Project", "projects");

//project customs

exports.isUniqueName = isUniqueField("Project", "name");
exports.isValidManager = isValidDocument("User", "Production Manager");
exports.isValidClient = isValidDocument("Client");
exports.isArrayOfTasks = isValidArrayOfIDs("Task", "chainOfTasks");
