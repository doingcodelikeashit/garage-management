const Otp = require("../Model/otp.model");
const Garage = require("../Model/garage.model");
const TempGarageRegistration = require("../Model/tempGarageRegistration.model");
const sendEmail = require("../Utils/mailer");
const bcrypt = require("bcrypt");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // First check if it's a pending registration
    const tempRegistration = await TempGarageRegistration.findOne({ email });
    if (tempRegistration) {
      return res.status(400).json({
        message: "Please use /resend-otp endpoint for pending registrations",
      });
    }

    const garage = await Garage.findOne({ email });

    if (!garage) {
      return res
        .status(404)
        .json({ message: "Garage not found at this email id" });
    }
    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (delete old if exists)
    await Otp.deleteMany({ email });
    const newOtp = new Otp({ email, otp: otpCode });
    await newOtp.save();

    // Send OTP by email
    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otpCode}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email, otp });
    const garage = await Garage.findOne({ email });

    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP already used
    if (otpRecord.isVerified) {
      return res.status(400).json({ message: "OTP already used" });
    }

    // Optional: Check for OTP expiry
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark OTP and garage as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    garage.isVerified = true;
    await garage.save();

    // Optional: Clean up OTP
    // await Otp.deleteMany({ email });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await Otp.findOne({ email });
    const garage = await Garage.findOne({ email });

    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({ message: "Invalid or unverified OTP" });
    }

    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    garage.password = hashedPassword;
    await garage.save();

    // Clean up OTP
    // await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  resetPassword,
};
