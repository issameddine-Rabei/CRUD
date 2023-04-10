const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter your name"],
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
      unique: [true, "email must be unique"],
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
      validate: {
        validator: async function (ids) {
          const employees = await mongoose
            .model("Project")
            .find({ _id: { $in: ids } });
          return employees.length === ids.length;
        },
        message: "All team members must have be Employee ",
      },
    },
  },
  {
    timestamps: true, //create 2 fields (createdAT and updated AT)
  }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
