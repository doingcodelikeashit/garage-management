const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  garageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garage",
    required: true
  },
  carName: String,
  model: String,
  partNumber: { type: String, required: true },
  partName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
