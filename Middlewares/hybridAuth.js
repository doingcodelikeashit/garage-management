const jwt = require("jsonwebtoken");
const User = require("../Model/user.model");
const Garage = require("../Model/garage.model");

// Hybrid auth middleware that accepts both user and garage tokens
const hybridAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find user first
    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        // For job card operations, we need to get the garage info from the user
        if (user.garageId) {
          const garage = await Garage.findById(user.garageId);
          if (garage) {
            req.garage = garage;
          }
        }
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

module.exports = hybridAuth;
