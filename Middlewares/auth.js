const jwt = require("jsonwebtoken");
const User = require("../Model/user.model");
const Garage = require("../Model/garage.model");

// Simple auth middleware without roles
const auth = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user first
      if (decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = user;
          return next();
        }
      }

      // Try to find garage if user not found
      if (decoded.garageId) {
        const garage = await Garage.findById(decoded.garageId);
        if (garage) {
          req.garage = garage;
          return next();
        }
      }

      return res.status(401).json({ message: "User or garage not found" });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Admin-only auth middleware (for admin-specific routes)
const adminAuth = () => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check for admin user
      if (decoded.userId) {
        const user = await User.findById(decoded.userId);
        if (user && (user.role === "admin" || user.role === "super-admin")) {
          req.user = user;
          return next();
        }
      }

      return res.status(403).json({ message: "Admin access required" });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = { auth, adminAuth };
