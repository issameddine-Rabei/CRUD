const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Task = require("./taskModel");

// ProjectSchema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: [true, "Project must belong to a Client"],
  },
  productionManager: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  team: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    default: [],
  },
  // Array of tasks for the project
  chainOfTasks: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "Task" }],
    default: [],
  },
  status: {
    type: String,
    enum: [
      "New",
      "In progress",
      "On hold",
      "Pending review",
      "Completed",
      "Cancelled",
    ],
    default: "New",
  },
  notes: [{ type: String }],
});

projectSchema.pre("validate", async function (next) {
  const newTasks = [];
  this.chainOfTasks.forEach(async (taskId) => {
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      const newTask = new Task({
        description: `New task added for Project ${this._id}`,
      });
      await newTask.save();
      this.chainOfTasks.push(newTask._id);
      newTasks.push(newTask);
    }
  });
  if (newTasks.length > 0) {
    console.log(
      `New tasks added to project ${this._id}: ${newTasks.map(
        (task) => task._id
      )}`
    );
  }
  next();
});

projectSchema.pre(
  "remove",
  asyncHandler(async function (next) {
    // 'this' refers to the project document being removed
    const tasks = await mongoose
      .model("Task")
      .deleteMany({ project: this._id });
    console.log(`${tasks.deletedCount} tasks succesfully deleted`);
    next();
  })
);

module.exports = mongoose.model("Project", projectSchema);
