const jwt = require("jsonwebtoken");
const Garage = require("../Model/garage.model");

const authGarage = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const garage = await Garage.findById(decoded.garageId);

    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    if (!garage.approved) {
      return res.status(403).json({ message: "Garage not approved" });
    }

    req.garage = garage;
    next();

  } catch (error) {
    res.status(401).json({ message: "Token is not valid", error: error.message });
  }
};

module.exports = authGarage;
