const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["super-admin", "admin", "manager", "staff"],
      default: "staff",
    },
    permissions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
