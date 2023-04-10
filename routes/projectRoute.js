const express = require("express");

const {
  getProjectByIdValidator,
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator,
} = require("../utils/validators/projectValidator");

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const taskRouter = require("./taskRoute");

const router = express.Router();

router.use("/:projectID/tasks", taskRouter);

router
  .route("/")
  .get(getAllProjects)
  .post(createProjectValidator, createProject);
router
  .route("/:id")
  .get(getProjectByIdValidator, getProjectById)
  .put(updateProject, updateProjectValidator)
  .delete(deleteProjectValidator, deleteProject);

module.exports = router;
