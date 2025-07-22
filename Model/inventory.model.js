const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    carName: { type: String, required: true },
    model: { type: String, required: true },
    partNumber: { type: String, required: true },
    partName: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    hsnNumber: { type: String, required: true },
    igst: { type: Number, default: 0 },
    cgstSgst: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
