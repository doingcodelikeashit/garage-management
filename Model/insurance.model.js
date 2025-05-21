const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema(
  {
    carNumber: {
      type: String,
      required: [true, "Car number is required"],
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9\s-]+$/, "Invalid car number format"],
    },
    type: {
      type: String,
      required: [true, "Insurance type is required"],
      // enum: ["Third-Party", "Comprehensive", "Own Damage"], // Customize as needed
    },
    company: {
      type: String,
      required: [true, "Insurance company is required"],
      trim: true,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Expiry date must be in the future",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insurance", InsuranceSchema);
