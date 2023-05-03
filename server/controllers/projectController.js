const slugify = require("slugify");
//const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ProjectModel = require("../models/projectModel");
const ApiError = require("../utils/apiError");
const ClientModel = require("../models/clientModel");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.query) filterObject = { ...req.query };
  if (req.params.clientID)
    filterObject = { client: req.params.clientID, ...filterObject };
  req.filterObject = filterObject;
  next();
};

// @desc    Get list of projects
// @route   GET /api/v1/projects
// @access  Private/Admin
exports.getAllProjects = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const projects = await ProjectModel.find(req.filterObject)
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "productionManager",
        select: "name ,_id",
        match: { role: "Production Manager" },
      },
      {
        path: "client",
        select: "name , _id",
      },
      {
        path: "team",
        select: "name _id",
      },
      {
        path: "chainOfTasks",
        select: "name , _id",
      },
    ]);
  res.status(200).json({
    message: `Projects successfully retrieved`,
    results: projects.length,
    projects,
  });
});

// @desc    Get specific project by id
// @route   GET /api/v1/projects/:id
// @access  Private/Admin
exports.getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await ProjectModel.findById(id).populate([
    {
      path: "productionManager",
      select: "name ,_id",
      match: { role: "Production Manager" },
    },
    {
      path: "client",
      select: "name , _id",
    },
    {
      path: "team",
      select: "name _id",
    },
    {
      path: "chainOfTasks",
      select: "name , _id",
    },
  ]);
  if (!project) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any project with the same id ${id}`, 404)
    );
  }
  res.status(200).json({
    status: "Project successfully retrieved",
    data: {
      project,
    },
  });
});

// @desc    Create project
// @route   POST  /api/v1/projects
// @access  Private/Admin
exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await ProjectModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  await ClientModel.findByIdAndUpdate(
    project.client, // the ID of the client document to update
    { $push: { projects: project._id } }, // use the $push operator to add the projectID to the projects array
    { new: true } // to return the updated document
  );

  res.status(201).json({
    message:
      "Project Initiated successfully and was added to the client's collection",
    project,
  });
});

// @desc    Update specific project
// @route   /projects/:id
// @access  Private/Admin
exports.updateProject = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const updated = { ...req.body };

  if (name) {
    updated.slug = slugify(name);
  }
  const project = await ProjectModel.findByIdAndUpdate(req.params.id, updated, {
    new: true,
    runValidators: true,
  }).populate([
    {
      path: "productionManager",
      select: "name ,_id",
      match: { role: "Production Manager" },
    },
    {
      path: "client",
      select: "name , _id",
    },
    {
      path: "team",
      select: "name _id",
    },
    {
      path: "chainOfTasks",
      select: "name , _id",
    },
  ]);

  if (!project) {
    return next(new ApiError(`No project for this id ${req.params.id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Project succesfully updated", data: project });
});

// @desc    Delete specific project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await ProjectModel.findByIdAndDelete(id).populate([
    {
      path: "productionManager",
      select: "name ,_id",
      match: { role: "Production Manager" },
    },
    {
      path: "client",
      select: "name , _id",
    },
    {
      path: "team",
      select: "name _id",
    },
    {
      path: "chainOfTasks",
      select: "name , _id",
    },
  ]);
  if (!project) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any project with the same id ${id}`, 404)
    );
  }

  res
    .status(200)
    .json({ message: "Project successfully deleted", data: project });
});
