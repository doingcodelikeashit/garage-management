const Otp = require("../Model/otp.model");
const Garage = require("../Model/garage.model");
const sendEmail = require("../Utils/mailer");
const bcrypt = require("bcrypt");
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const garage = await Garage.findOne({ email });

    if (!garage) {
      return res
        .status(404)
        .json({ message: "Garage with this email not found" });
    }

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP (delete old if exists)
    await OTP.deleteMany({ email });
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

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Reset Password (only if OTP verified)
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({ message: "OTP not verified or expired" });
    }

    const garage = await Garage.findOne({ email });
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    garage.password = hashedPassword;
    await garage.save();

    // Remove OTP record after successful reset
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, resetPassword };
