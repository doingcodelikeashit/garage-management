const express = require("express");
const {
  createGarage,
  garageLogin,
  getAllGarages,
  updateGarage,
  deleteGarage,
} = require("../Controllers/garage.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();

router.post("/login", garageLogin);

// Protected routes (Super Admin Only or Role-based)
router.use(authGarage);

router.post("/create", checkPermission("garage:create"), createGarage);
router.get("/allgarages", checkPermission("garage:view"), getAllGarages);
router.put("/allgarages/:id", checkPermission("garage:update"), updateGarage);
router.delete(
  "/allgarages/:id",
  checkPermission("garage:delete"),
  deleteGarage
);

// Nested payment routes (inherits authGarage)
router.use("/payment", require("./payment.routes"));

module.exports = router;
