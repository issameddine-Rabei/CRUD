const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const subUserModel = require("../models/subUserModel");

exports.setUserIdToBody = (req, res, next) => {
  //Nested routes
  if (!req.body.user) req.body.user = req.params.userId;
  next();
};

exports.createFilterObj = (req, res, next) =>{
  let filterObject = {};
  if (req.params.userId) filterObject = { user: req.params.userId };
  req.filterObject = filterObject;
  next()
}

// @desc    Get list of users
// @route   GET /subusers
// @access  Private/Admin
exports.getAllSubUsers = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const SubUsers = await subUserModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit);
  //.populate({ path: "user", select: "name -_id" });
  //if we need to show the user we use the populate function and
  //select to select which propreties we want to get
  res.status(200).json({ results: SubUsers.length, page, SubUsers });
});

// @desc    Get specific user by id
// @route   GET /subusers/:id
// @access  Private/Admin
exports.getSubUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const SubUser = await subUserModel.findById(id);
  //.populate({ path: "user", select: "name -_id" });
  //if we need to show the user we use the populate function and
  //select to select which propreties we want to get
  if (!SubUser) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any SubUser with the same id ${id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "SubUser succesfully retrieved ", Subuser: SubUser });
});

// @desc    Create user
// @route   POST  /subusers
// @access  Private/Admin
exports.createSubUser = asyncHandler(async (req, res) => {
  const SubUser = await subUserModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(200).json({ message: "subUser created succesfully", SubUser });
});

// @desc    Update specific user
// @route   /subusers/:id
// @access  Private/Admin
exports.updateSubUser = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const updated = { ...req.body };

  if (name) {
    updated.slug = slugify(name);
  }
  const document = await subUserModel.findByIdAndUpdate(
    req.params.id,
    updated,
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No SubUser for this id ${req.params.id}`, 404));
  }
  res
    .status(200)
    .json({ message: "SubUser succesfully updated", data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteSubUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subUser = await subUserModel.findByIdAndDelete(id);
  if (!subUser) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any SubUser with the same id ${id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "SubUser successfully deleted", data: subUser });
});
