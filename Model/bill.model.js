const mongoose = require("mongoose");
const BillSchema = new mongoose.Schema(
  {
    jobCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCard",
      required: true,
    },
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    invoiceNo: String,
    parts: Array,
    services: Array,
    totalPartsCost: Number,
    totalLaborCost: Number,
    subTotal: Number,
    gst: Number,
    gstPercentage: Number,
    discount: Number,
    finalAmount: Number,
    isPaid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "online",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    razorpayOrderId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
