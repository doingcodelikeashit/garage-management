const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: "admin@garage.com"
  },
  password: {
    type: String,
    required: true,
    default:"admin1234"
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
