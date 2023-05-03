const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const machineModel = require("../models/machineModel");

// @desc    Get list of machines
// @route   GET /api/v1/machines
// @access  Private/Admin
exports.getAllmachines = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const machines = await machineModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: machines.length, page, machines });
});

// @desc    Get specific machine by id
// @route   GET /api/v1/machines/:id
// @access  Private/Admin
exports.getmachineById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const machine = await machineModel.findById(id);
  if (!machine) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any machine with the same id ${id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "machine succesfully retrieved ", machine: machine });
});

// @desc    Create machine
// @route   POST  /api/v1/machines
// @access  Private/Admin
exports.createmachine = asyncHandler(async (req, res) => {
  const machine = await machineModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res
    .status(200)
    .json({ message: "machine created succesfully", machine: machine });
});

// @desc    Update specific machine
// @route   PUT /api/v1/machines/:id
// @access  Private/Admin
exports.updatemachine = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const updatedmachine = { ...req.body };

  if (name) {
    updatedmachine.slug = slugify(name);
  }
  const machine = await machineModel.findByIdAndUpdate(
    req.params.id,
    updatedmachine,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!machine) {
    return next(new ApiError(`No machine for this id ${req.params.id}`, 404));
  }
  res
    .status(200)
    .json({ message: "machine succesfully updated", updatedmachine: machine });
});

// @desc    Delete specific machine
// @route   DELETE /api/v1/machines/:id
// @access  Private/Admin
exports.deletemachine = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const machine = await machineModel.findByIdAndDelete(id);
  if (!machine) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any machine with the same id ${id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "machine successfully deleted", machine: machine });
});
