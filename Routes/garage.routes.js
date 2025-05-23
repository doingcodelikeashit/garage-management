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
const {
  createUser,
  updatePermissions,
  deleteUser,
  getAllUsers,
} = require("../Controllers/superadmin.controller");

// Public Route
router.post("/login", garageLogin);

// Protected Routes (Require Authentication)
router.use(authGarage);

// Garage Management Routes (Role-based Access Control)
router.post("/create", checkPermission("garage:create"), createGarage);
router.get("/allgarages", checkPermission("garage:view"), getAllGarages);
router.put("/allgarages/:id", checkPermission("garage:update"), updateGarage);
router.delete(
  "/allgarages/:id",
  checkPermission("garage:delete"),
  deleteGarage
);

// User Management Routes (Role-based Access Control)
router.post("/create-user", checkPermission("user:create"), createUser);
router.put(
  "/update-permissions/:id",
  checkPermission("user:update"),
  updatePermissions
);
router.delete("/delete-user/:id", checkPermission("user:delete"), deleteUser);
router.get("/users", checkPermission("user:view"), getAllUsers);

// Nested Routes (e.g., Payment)
router.use("/payment", require("./payment.routes"));

module.exports = router;
