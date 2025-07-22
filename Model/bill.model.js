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
    invoiceNo: String, // Will be generated per garage, starting at 001
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
    // New fields for requirements
    billType: { type: String, enum: ["gst", "non-gst"], default: "gst" },
    hsnCode: { type: String },
    logo: { type: String },
    billToParty: { type: String },
    shiftToParty: { type: String },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      branchName: String,
      upiId: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
