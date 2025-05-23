const Admin = require("../Model/admin.model"); // adjust path as needed
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();
const Connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    // console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`MongoDB Connected:`);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: "super-admin",
      });
      await newAdmin.save();
      console.log("Admin created (admin@garage.com / admin1234)");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = Connect;
