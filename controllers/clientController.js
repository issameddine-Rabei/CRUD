const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const clientModel = require("../models/clientModel");

// @access Public
exports.getAllClients = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const Clients = await clientModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: Clients.length, page, Clients });
});

// @access Private
exports.createClient = asyncHandler(async (req, res) => {
  const Client = await clientModel.create({
    ...req.body,
    slug: slugify(req.body.name),
  });
  res.status(200).json({ message: "Client created succesfully", Client });
});

// @access Public
exports.getClientById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Client = await clientModel.findById(id);
  if (!Client) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any client with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "Client succesfully retrieved ", Client });
});

// @access Private
exports.updateClient = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const updatedClient = { ...req.body };

  if (name) {
    updatedClient.slug = slugify(name);
  }

  const Client = await clientModel.findByIdAndUpdate(
    req.params.id,
    updatedClient,
    { new: true, runValidators: true }
  );

  if (!Client) {
    //return res.status(404).json({message: `cannot find any client with the same id ${id}`})
    return next(
      new ApiError(
        `cannot find any client with the same id ${req.params.id}`,
        404
      )
    );
  }
  //const updatedClient = await clientModel.findById(id)
  //instead of creating new instance and displaying it
  //we can use the {new : true} opttion in findByIdAndUpdate()
  res.status(200).json({ message: "Client successfully updated", Client });
});

// @access Private
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Client = await clientModel.findByIdAndDelete(id);
  if (!Client) {
    //return res.status(404).json({message:`cannot find any client with the same id ${id}`})
    return next(
      new ApiError(`cannot find any client with the same id ${id}`, 404)
    );
  }
  res.status(200).json({ message: "Client successfully deleted", Client });
});
