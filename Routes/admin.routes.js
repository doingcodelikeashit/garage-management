const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin.controller");
const garageController = require("../Controllers/garage.controller");
const { adminAuth } = require("../Middlewares/auth");
const planController = require("../Controllers/plan.controller");

// Plan management (Admin only)
router.get("/plan", planController.getAllPlans);
router.post("/plan", adminAuth(), planController.createPlan);
router.get("/plan/:id", adminAuth(), planController.getPlanById);
router.put("/plan/:id", adminAuth(), planController.updatePlan);
router.delete("/plan/:id", adminAuth(), planController.deletePlan);

// Admin authentication
router.post("/login", adminController.login);
router.put("/update/password", adminAuth(), adminController.updatePassword);

// Job Card History (Admin only)
router.get(
  "/jobcardhistory",
  adminAuth(),
  adminController.getAllJobCardHistory
);

// Garage management (Admin only)
router.get("/allgarages", adminAuth(), garageController.getAllGarages);

// Garage Approval (Admin only)
router.get("/garages/pending", adminAuth(), adminController.getPendingGarages);
router.put("/garages/approve/:id", adminAuth(), adminController.approveGarage);
router.put("/garages/reject/:id", adminAuth(), adminController.rejectGarage);

// Insurance management (Admin only)
router.post("/insurance/add", adminAuth(), adminController.addInsurance);
router.get(
  "/insurance/expiring",
  adminAuth(),
  adminController.getExpiringInsurance
);

module.exports = router;
