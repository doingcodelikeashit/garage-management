const express = require("express");
const {
  createGarage,
  garageLogin,
  getAllGarages,
  updateGarage,
  deleteGarage,
} = require("../Controllers/garage.controller");

const router = express.Router();

// Create Garage (Super Admin Only)
router.post("/create", createGarage);
router.post("/login", garageLogin);
router.get("/allgarages", getAllGarages);
router.use("/payment", require("./payment.routes"));
router.put("/allgarages/:id", updateGarage);
router.delete("/allgarages/:id", deleteGarage);
module.exports = router;
