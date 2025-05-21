const mongoose = require("mongoose");

const JobCardSchema = new mongoose.Schema({
  garageId: { type: mongoose.Schema.Types.ObjectId, ref: "Garage", required: true },
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer", default: null }, // Engineer is assigned later
  customerNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  company: { type: String },
  carNumber: { type: String, required: true },
  model: { type: String, required: true },
  kilometer: { type: Number, required: true },
  fuelType: { type: String, required: true },
  insuranceProvider: { type: String },
  policyNumber: { type: String },
  expiryDate: { type: Date },
  registrationNumber: { type: String },
  type: { type: String },
  excessAmount: { type: Number },
  jobDetails: { type: String },
  status: { 
    type: String, 
    enum: ["In Progress", "Completed", "Pending", "Cancelled"], 
    default: "In Progress"  // Default job status
  },
  images: [{ type: String }], 
  video: { type: String },
  partsUsed: [{
    partName: String,
    quantity: Number,
    pricePerPiece: Number,
    totalPrice: Number
  }],
  laborHours: Number,
  engineerRemarks: String,
  qualityCheck: {
    notes: String,
    date: Date,
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engineer" // Assuming engineers do QC
    },
    billApproved: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

const JobCard = mongoose.model("JobCard", JobCardSchema);
module.exports = JobCard;
