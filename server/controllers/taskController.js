const asyncHandler = require("express-async-handler");
//const { v4: uuidv4 } = require('uuid');
//const sharp = require('sharp');
//const bcrypt = require('bcryptjs');
//const factory = require('./handlersFactory');
const ApiError = require("../utils/apiError");
//const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
//const createToken = require('../utils/createToken');
const taskModel = require("../models/taskModel");
const ProjectModel = require("../models/projectModel");

exports.setProjectIdToBody = (req, res, next) => {
  //Nested routes
  //accessing the params(projectId in this case ) from another route through nested routes
  //so that i can add it to my req.body and do my query on it(creating a task for my project)
  if (!req.body.project) req.body.project = req.params.projectID;
  next();
};

exports.createFilterObj = (req, res, next) => {
  //putting my filterobj(projectid in my req.params) if provided in my request so that i can do my query on it
  //to get the chainOftasks for my project
  let filterObject = {};
  if (req.params.projectID) filterObject = { project: req.params.projectID };
  req.filterObject = filterObject;
  next();
};

// @desc    Get list of tasks
// @route   GET /api/v1/:projectid/tasks
// @access  Private/Admin
exports.getProjectTasks = asyncHandler(async (req, res) => {
  const task = await taskModel.find(req.filterObject).populate([
    {
      path: "machine",
      select: "name -_id",
    },
    {
      path: "employee",
      select: "name -_id",
    },
    {
      path: "project",
      select: "name -_id",
    },
  ]);
  res.status(200).json({ results: task.length, tasks: task });
});

// @desc    Get specific task by id
// @route   GET /api/v1/:projectid/tasks/:id
// @access  Private/Admin
exports.getTaskById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await taskModel.findById(id).populate([
    {
      path: "machine",
      select: "name -_id",
    },
    {
      path: "employee",
      select: "name -_id",
    },
    {
      path: "project",
      select: "name -_id",
    },
  ]);
  if (!task) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any task with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "task succesfully retrieved ", task });
});

// @desc    Create task
// @route   POST  /api/v1/:projectid/tasks/:id
// @access  Private/Admin
exports.createTask = asyncHandler(async (req, res) => {
  const task = await taskModel.create({
    ...req.body,
  });
  await ProjectModel.findByIdAndUpdate(
    task.project,
    { $push: { chainOfTasks: task._id } },
    { new: true }
  );
  res.status(200).json({ message: "task created succesfully", task });
});

// @desc    Update specific task
// @route   PUT /api/v1/projectid/tasks/:id
// @access  Private/Admin
exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await taskModel
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    .populate([
      {
        path: "machine",
        select: "name -_id",
      },
      {
        path: "employee",
        select: "name -_id",
      },
      {
        path: "project",
        select: "name -_id",
      },
    ]);

  if (!task) {
    return next(new ApiError(`No task for this id ${req.params.id}`, 404));
  }
  res
    .status(200)
    .json({ message: "task succesfully updated", updatedtask: task });
});

// @desc    Delete specific task
// @route   DELETE /api/v1/:projectsid/tasks/:id
// @access  Private/Admin
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await taskModel.findByIdAndDelete(id);
  if (!task) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any task with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "task successfully deleted", task });
});
