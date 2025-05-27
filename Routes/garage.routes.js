const express = require("express");
const {
  createGarage,
  garageLogin,
  getAllGarages,
  updateGarage,
  deleteGarage,
  getMe,
} = require("../Controllers/garage.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();
const {
  createUser,
  userLogin,
  updatePermissions,
  deleteUser,
  getAllUsers,
} = require("../Controllers/superadmin.controller");

// Public Route
router.post("/login", garageLogin);
router.post("/create", createGarage);
router.use("/payment", require("./payment.routes"));
router.post("/user/login", userLogin);
// Protected Routes (Require Authentication)
router.use(authGarage);
router.get("/getme", getMe);
// Garage Management Routes (Role-based Access Control)
router.get("/allgarages", checkPermission("garage:view"), getAllGarages);
router.put("/allgarages/:id", checkPermission("garage:update"), updateGarage);
router.delete(
  "/allgarages/:id",
  checkPermission("garage:delete"),
  deleteGarage
);

// User Management Routes (Role-based Access Control)
router.post("/create-user", createUser);
router.put("/update-permissions/:id", updatePermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/users", getAllUsers);

// Nested Routes (e.g., Payment)
module.exports = router;
