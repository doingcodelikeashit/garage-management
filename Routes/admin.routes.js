const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin.controller");
const garageController = require("../Controllers/garage.controller");
const auth = require("../Middlewares/auth");
// const checkPermission = require("../Middlewares/checkpermission");
const { verifyToken } = require("../Middlewares/adminAuth");
router.post("/login", adminController.login);
router.put("/update/password", adminController.updatePassword);
// Job Card History
router.get(
  "/jobcardhistory",
  verifyToken,
  // checkPermission("jobcard:read"),
  adminController.getAllJobCardHistory
);
router.get("/allgarages", verifyToken, garageController.getAllGarages);
// Garage Approval
router.get(
  "/garages/pending",
  // auth(),
  verifyToken,
  // checkPermission("garage:read"),
  adminController.getPendingGarages
);

router.put(
  "/garages/approve/:id",
  verifyToken,
  // checkPermission("garage:approve"),
  adminController.approveGarage
);
// Insurance
router.post(
  "/insurance/add",
  verifyToken,
  // auth(),
  // checkPermission("insurance:add"),
  adminController.addInsurance
);

router.get(
  "/insurance/expiring",
  verifyToken,
  // auth(),
  // checkPermission("insurance:view-expiring"),
  adminController.getExpiringInsurance
);

module.exports = router;
