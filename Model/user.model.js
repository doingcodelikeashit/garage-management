const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
    garage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
