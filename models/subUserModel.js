const mongoose = require("mongoose");

const subUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubUser must be unique"],
      minlength: [3, "Too short SubUser name"],
      maxlength: [32, "Too long SubUser name "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "SubUser must belong to parent User"],
      minlength: [8, "SubUser length must be at least 8"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("SubUser", subUserSchema);
