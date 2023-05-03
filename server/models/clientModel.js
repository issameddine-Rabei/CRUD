const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
      unique: [true, "Client with the same name already exists"],
    },
    // slug: A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter your email"],
      unique: [true, "email already in use"],
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    projects: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Project" }],
    },
  },
  {
    timestamps: true, //create 2 fields (createdAT and updated AT)
  }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
