const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin.controller");
const { verifyToken } = require("../Middlewares/adminAuth");
// Admin routes
router.get("/jobcardhistory", verifyToken, adminController.getAllJobCardHistory);
router.post("/login", adminController.login);
router.put("/update/password", adminController.updatePassword);
router.get("/garages/pending", adminController.getPendingGarages);
router.put("/garages/approve/:id", adminController.approveGarage);

// Inventory
router.post("/inventory/add", verifyToken, adminController.addPart);
router.put("/inventory/update/:id", verifyToken, adminController.updatePart);

// Insurance
router.post("/insurance/add", verifyToken, adminController.addInsurance);
router.get(
  "/insurance/expiring",
  verifyToken,
  adminController.getExpiringInsurance
);
module.exports = router;
