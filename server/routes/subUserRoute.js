const express = require("express");
const {
  getAllSubUsers,
  createSubUser,
  getSubUserById,
  updateSubUser,
  deleteSubUser,
  setUserIdToBody,
  createFilterObj,
} = require("../controllers/subUserController");
const {
  getsubUserByIdValidator,
  createsubUserValidator,
  updateClientValidator,
  deleteClientValidator,
} = require("../utils/validators/subUserValidator");

const router = express.Router({ mergeParams: true });
//mergeParams allow us to access parametres on other routers
//exp: we need to access the userId from the userRouter

router
  .route("/")
  .get(createFilterObj, getAllSubUsers)
  .post(setUserIdToBody, createsubUserValidator, createSubUser);
router
  .route("/:id")
  .get(getsubUserByIdValidator, getSubUserById)
  .put(updateClientValidator, updateSubUser)
  .delete(deleteClientValidator, deleteSubUser);

module.exports = router;
