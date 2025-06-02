const Admin = require("../Model/admin.model");
const Garage = require("../Model/garage.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/mailer");
const inventoryModel = require("../Model/inventory.model");
const Insurance = require("../Model/insurance.model");
const JobCard = require("../Model/jobCard.model");
// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Pending Garages
exports.getPendingGarages = async (req, res) => {
  try {
    const garages = await Garage.find({ approved: false });
    res.json({ garages });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve Garage
exports.approveGarage = async (req, res) => {
  try {
    const { id } = req.params;

    const garage = await Garage.findById(id);
    if (!garage) return res.status(404).json({ message: "Garage not found" });

    garage.approved = true;
    await garage.save();

    // Send approval email
    await sendEmail(
      garage.email,
      "Garage Approved",
      `Hi ${garage.name}, your garage has been approved. You may now log in.`
    );

    res.json({ message: "Garage approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Add Part
exports.addPart = async (req, res) => {
  try {
    const part = new inventoryModel(req.body);
    await part.save();
    res.status(201).json(part);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Part
exports.updatePart = async (req, res) => {
  try {
    const updatedPart = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPart)
      return res.status(404).json({ message: "Part not found" });
    res.json(updatedPart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Insurance
exports.addInsurance = async (req, res) => {
  try {
    const insurance = new Insurance(req.body);
    await insurance.save();
    res.status(201).json(insurance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Expiring Insurance (next 30 days)
exports.getExpiringInsurance = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const insurances = await Insurance.find({
      expiryDate: { $gte: today, $lte: nextMonth },
    });

    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJobCardHistory = async (req, res) => {
  try {
    const jobCards = await JobCard.find() // QC engineer
      .sort({ createdAt: -1 }); // Latest first
    res.status(200).json({
      success: true,
      count: jobCards.length,
      data: jobCards,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
