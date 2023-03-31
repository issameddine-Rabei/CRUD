const asyncHandler = require("express-async-handler");
//const { v4: uuidv4 } = require('uuid');
//const sharp = require('sharp');
//const bcrypt = require('bcryptjs');
const slugify = require("slugify");
//const factory = require('./handlersFactory');
const ApiError = require("../utils/apiError");
//const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
//const createToken = require('../utils/createToken');
const UserModel = require("../models/userModel");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const users = await UserModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: users.length, page, users });
});

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any user with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "User succesfully retrieved ", user: user });
});

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => { 
  
  const user = await UserModel.create({ ...req.body, slug: slugify(req.body.name)});
  res.status(200).json({ message: "User created succesfully", user: user });
});

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const updatedUser = { ...req.body };

  if (name) {
    updatedUser.slug = slugify(name);
  }
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    updatedUser,
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No User for this id ${req.params.id}`, 404));
  }
  res
    .status(200)
    .json({ message: "User succesfully updated", updatedUser: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any User with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "User successfully deleted", user: user });
});
