const express = require("express");
const {
  getAllSubUsers,
  createSubUser,
  getSubUserById,
  updateSubUser,
  deleteSubUser,
} = require("../controllers/subUserController");
const {
  getsubUserByIdValidator,
  createsubUserValidator,
  updateClientValidator,
  deleteClientValidator,
} = require("../utils/validators/subUserValidator");

const router = express.Router();

router
  .route("/")
  .get(getAllSubUsers)
  .post(createsubUserValidator, createSubUser);
router
  .route("/:id")
  .get(getsubUserByIdValidator, getSubUserById)
  .put(updateClientValidator, updateSubUser)
  .delete(deleteClientValidator, deleteSubUser);

module.exports = router;
