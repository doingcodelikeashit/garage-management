const mongoose = require("mongoose");

const TempGarageRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gstNum: { type: String },
    panNum: { type: String },
    bankDetails: {
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      branchName: { type: String },
      upiId: { type: String },
    },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TempGarageRegistration",
  TempGarageRegistrationSchema
);
