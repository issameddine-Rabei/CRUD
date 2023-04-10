const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

// user customs
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

exports.isUniqueEmail = isUniqueField("User", "email");
exports.isUniqueUsername = isUniqueField("User", "username");

//task customs
const isValidDocument = (model, role) =>
  asyncHandler(async (id) => {
    const doc = await mongoose.model(model).findById(id);
    if (!doc) {
      throw new ApiError(`${model} not found`, 404);
    }
    if (role && doc.role !== role) {
      throw new ApiError(`User is not a ${role}`, 401);
    }
    return true;
  });

exports.isValidProject = isValidDocument("Project");
exports.isValidEmployee = isValidDocument("User", "Employee");
exports.isValidMachine = isValidDocument("Machine");
exports.isValidManager = isValidDocument("User", "Production Manager");
exports.isValidClient = isValidDocument("Client");

//project customs
exports.isArrayOfEmployeeIds = async (value) => {
  const invalidIds = value.filter((id) => !mongoose.isValidObjectId(id));
  if (invalidIds.length > 0) {
    throw new ApiError(
      "All the employees IDs should have a valid format ",
      400
    );
  }
  const validationPromises = value.map((id) =>
    isValidDocument("User", "Employee")(id)
  );
  const validationResults = await Promise.all(validationPromises);
  if (validationResults.includes(false)) {
    throw new ApiError("All elements of the array should refer to valid employees", 404);
  }

  return true;
};


exports.isArrayOfTasks = async (value) => {
  if (!value.every((task) => task instanceof mongoose.model("Task"))) {
    throw new ApiError("chainOfTasks must be an array of Tasks", 400);
  }
  const validationArray = value.map((task) =>
    isValidDocument("Task")(task._id)
  );
  const validationResults = await Promise.all(validationArray);
  if (validationResults.includes(false)) {
    throw new ApiError("All elements of the array should be valid Tasks", 404);
  }
  return true;
};
