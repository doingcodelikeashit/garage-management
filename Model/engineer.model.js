const mongoose = require("mongoose");

const EngineerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  garageId: { type: mongoose.Schema.Types.ObjectId, ref: "Garage", required: true },
}, { timestamps: true });

const Engineer = mongoose.model("Engineer", EngineerSchema);
module.exports = Engineer;
