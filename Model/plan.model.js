const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    subscriptionType: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
