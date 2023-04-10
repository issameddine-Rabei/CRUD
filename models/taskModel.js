const mongoose = require("mongoose");

// TaskSchema
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "New Task",
    required: true,
  },
  number: {
    type: Number,
    unique: true,
  },
  state: {
    type: String,
    enum: ["Ready", "Being Done", "Completed"],
    default: "Ready",
  },
  description: {
    type: String,
  },
  machine: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Machine",
  },
  employee: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
