const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin.controller");
const auth = require("../Middlewares/auth");
const checkPermission = require("../Middlewares/checkpermission");
router.post("/login", adminController.login);
router.put("/update/password", adminController.updatePassword);
// Job Card History
router.get(
  "/jobcardhistory",
  auth(),
  checkPermission("jobcard:read"),
  adminController.getAllJobCardHistory
);

// Garage Approval
router.get(
  "/garages/pending",
  auth(),
  checkPermission("garage:read"),
  adminController.getPendingGarages
);

router.put(
  "/garages/approve/:id",
  auth(),
  checkPermission("garage:approve"),
  adminController.approveGarage
);

// Inventory
router.post(
  "/inventory/add",
  auth(),
  checkPermission("inventory:add"),
  adminController.addPart
);

router.put(
  "/inventory/update/:id",
  auth(),
  checkPermission("inventory:update"),
  adminController.updatePart
);

// Insurance
router.post(
  "/insurance/add",
  auth(),
  checkPermission("insurance:add"),
  adminController.addInsurance
);

router.get(
  "/insurance/expiring",
  auth(),
  checkPermission("insurance:view-expiring"),
  adminController.getExpiringInsurance
);

module.exports = router;
