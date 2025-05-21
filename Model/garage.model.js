const mongoose = require("mongoose");

const GarageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Admin Password
    approved: { type: Boolean, default: false }, // Super admin approves it
    subscriptionType: {
      type: String,
      enum: ["3_months", "6_months", "1_year"],
      required: true,
    },
    subscriptionStart: {
      type: Date,
      default: Date.now,
    },
    subscriptionEnd: {
      type: Date,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      paymentId: String, // e.g. Razorpay/Stripe transaction ID
      amount: Number,
      method: String, // e.g. "card", "upi", "netbanking"
      status: String, // e.g. "paid", "pending", "failed"
    },
  },
  { timestamps: true }
);

const Garage = mongoose.model("Garage", GarageSchema);
module.exports = Garage;
