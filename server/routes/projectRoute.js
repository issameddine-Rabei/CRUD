const express = require("express");

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createFilterObj,
} = require("../controllers/projectController");

const {
  getProjectByIdValidator,
  createProjectValidator,
  updateProjectValidator,
  deleteProjectValidator,
} = require("../utils/validators/projectValidator");

const taskRouter = require("./taskRoute");

const router = express.Router({ mergeParams: true });

router.use("/:projectID/tasks", taskRouter);

router.route("/").get(createFilterObj, getAllProjects);
router
  .route("/create")
  .post(createFilterObj, createProjectValidator, createProject);
router
  .route("/:id")
  .get(getProjectByIdValidator, getProjectById)
  .put(updateProject, updateProjectValidator)
  .delete(deleteProjectValidator, deleteProject);
/*router
  .route("/add")
  .put(setClientIdToBody, addProjectToClientValidator, addProjectToClient);*/

module.exports = router;
