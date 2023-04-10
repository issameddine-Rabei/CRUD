const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const projectModel = require("../models/projectModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of projects
// @route   GET /api/v1/projects
// @access  Private/Admin
exports.getAllProjects = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const projects = await projectModel
    .find({})
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
    message: "Projects successfully retrieved",
    results: projects.length,
    projects,
  });
});

// @desc    Get specific project by id
// @route   GET /api/v1/projects/:id
// @access  Private/Admin
exports.getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await projectModel.findById(id).populate([
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
  const project = await projectModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(201).json({
    message: "Project Initiated successfully",

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
  const project = await projectModel
    .findByIdAndUpdate(req.params.id, updated, {
      new: true,
      runValidators: true,
    })
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
  const project = await projectModel.findByIdAndDelete(id).populate([
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
