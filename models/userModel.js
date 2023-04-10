const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username Required"],
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      require: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      require: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    role: {
      type: String,
      enum: ["Employee", "Superadmin", "Production Manager"],
      default: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
