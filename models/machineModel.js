const mongoose = require("mongoose");

const machineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    enum: [
      "Running", // When the machine is operating normally and performing its intended function
      "Stopped", //When the machine is not running, either due to maintenance, repair, or some other reason.
      "Faulted", //When the machine has encountered an error or fault and requires attention from maintenance personnel.
      "Idle", //When the machine is not running but is in a state of readiness, waiting for the next task or operation.
      "Setup", //When the machine is being prepared for a specific task or operation, such as adjusting tooling or changing settings.
      "Cleaning", //When the machine is being cleaned or maintained to prevent contamination or degradation of performance.
      "Offline", //When the machine is not connected to the network or is not available for use.
    ],
  },
  costPerHour: {
    type: String,
    required: true,
  },
  maintenanceHistory: [
    {
      date: { type: Date, required: true },
      description: { type: String, required: true },
    },
  ],
  image: [String],
  imageCover: {
    type: String,
    required: [true, "image cover is required"],
  },
});

module.exports = mongoose.model("Machine", machineSchema);
