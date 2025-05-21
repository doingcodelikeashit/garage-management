const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Garage = require("../Model/garage.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
// const razorpay = require("../utils/razorpay");

const createGarage = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      email,
      password,
      subscriptionType,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Validate subscription type
    const validSubscriptions = ["3_months", "6_months", "1_year"];
    if (!validSubscriptions.includes(subscriptionType)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    // Validate Razorpay payment signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    // Check for existing garage
    const existingGarage = await Garage.findOne({ email });
    if (existingGarage) {
      return res.status(400).json({ message: "Garage already exists" });
    }

    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    const durationMap = {
      "3_months": 3,
      "6_months": 6,
      "1_year": 12,
    };
    endDate.setMonth(endDate.getMonth() + durationMap[subscriptionType]);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newGarage = new Garage({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      subscriptionType,
      subscriptionStart: startDate,
      subscriptionEnd: endDate,
      isSubscribed: true,
      paymentDetails: {
        paymentId: razorpayPaymentId,
        amount: req.body.amount,
        method: "razorpay",
        status: "paid",
      },
    });

    await newGarage.save();

    res.status(201).json({
      message:
        "Garage created and subscription activated. Waiting for admin approval.",
      garage: newGarage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const garageLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const garage = await Garage.findOne({ email });

    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    if (!garage.approved) {
      return res.status(403).json({ message: "Garage not approved by admin" });
    }

    const isMatch = await bcrypt.compare(password, garage.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create token
    const token = jwt.sign({ garageId: garage._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      garage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllGarages = async (req, res) => {
  try {
    const garages = await Garage.find();
    res.status(200).json({ message: "Garages retrieved", garages });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateGarage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;

    const updatedGarage = await Garage.findByIdAndUpdate(
      id,
      { name, address, phone, email },
      { new: true }
    );

    if (!updatedGarage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    res
      .status(200)
      .json({ message: "Garage updated successfully", updatedGarage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGarage = await Garage.findByIdAndDelete(id);

    if (!deletedGarage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    res.status(200).json({ message: "Garage deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createGarage,
  garageLogin,
  getAllGarages,
  updateGarage,
  deleteGarage,
};
