const asyncHandler = require("express-async-handler");
//const mongoose = require("mongoose");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const clientModel = require("../models/clientModel");
const projectModel = require("../models/projectModel");

// @access Public
exports.getAllClients = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const Clients = await clientModel
    .find({})
    .populate({ path: "projects", select: "name ,-_id" })
    .skip(skip)
    .limit(limit);
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

// @desc    Add specific project to specific client
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin

exports.addProjectToClient = asyncHandler(async (req, res, next) => {
  const { clientName, projectName } = req.body;

  const project = await projectModel
    .findOne({ name: projectName })
    .populate({ path: "client", select: "name" });

  if (!project) {
    return next(new ApiError(`No project with this name ${projectName}`, 404));
  }

  if (project.client.name === clientName) {
    return next(
      new ApiError(
        `The project ${projectName} already belongs to ${clientName}`,
        400
      )
    );
  }

  const Client = await clientModel.findOneAndUpdate(
    { name: clientName }, // the ID of the client document to update
    { $push: { projects: project._id } }, // use the $push operator to add the projectID to the projects array
    { new: true } // to return the updated document
  );

  if (!Client) {
    return next(new ApiError(`No client with this name ${clientName}`, 404));
  }

  project.client = Client._id;
  await project.save();

  res.status(200).json({
    message: `Project added successfully added to ${Client.name}'s collection`,
    Projects: Client.projects,
  });
});

// @access Public
exports.clientsProjectsList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Client = await clientModel
    .findById(id)
    .populate({ path: "projects", select: "name ,-_id" });
  if (!Client) {
    return next(
      new ApiError(`cannot find any client with the same id ${id}`, 404)
    );
  }
  if (Client.projects.length === 0) {
    res.send("No projects found.");
  }
  res.json({
    Projects: Client.projects,
  });
});
