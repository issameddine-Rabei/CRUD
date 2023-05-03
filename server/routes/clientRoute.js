const express = require("express");
const {
  getClientByIdValidator,
  createClientValidator,
  updateClientValidator,
  deleteClientValidator,
} = require("../utils/validators/clientValidator");

const {
  getAllClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  clientsProjectsList,
  addProjectToClient,
} = require("../controllers/clientController");

const projectRouter = require("./projectRoute");

const router = express.Router();

router.use("/:clientID/projects", projectRouter);

router.route("/").get(getAllClients).put(addProjectToClient);
router.route("/create").post(createClientValidator, createClient);
router
  .route("/:id")
  .get(getClientByIdValidator, getClientById)
  .put(updateClientValidator, updateClient)
  .delete(deleteClientValidator, deleteClient);
router.route("/:id/listofprojects").get(clientsProjectsList);
//router.route("/addprojects").put(addProjectToClient);

module.exports = router;
