const express = require("express");
const {
  getProjectTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  createFilterObj,
  setProjectIdToBody,
} = require("../controllers/taskController");
const {
  getTaskByIdValidator,
  createTaskValidator,
  updateTaskValidator,
  deleteTaskValidator,
} = require("../utils/validators/taskValidator");

const router = express.Router({ mergeParams: true });
//mergeParams allow us to access parametres on other routers
//exp: we need to access the userId from the userRouter

router
  .route("/")
  .get(createFilterObj, getProjectTasks)
  .post(setProjectIdToBody, createTaskValidator, createTask);
router
  .route("/:id")
  .get(getTaskByIdValidator, getTaskById)
  .put(updateTaskValidator, updateTask)
  .delete(deleteTaskValidator, deleteTask);

module.exports = router;
