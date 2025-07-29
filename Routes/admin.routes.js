const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin.controller");
const garageController = require("../Controllers/garage.controller");
const { adminAuth } = require("../Middlewares/auth");
const planController = require("../Controllers/plan.controller");

// Plan management (Admin only)
router.get("/plan", planController.getAllPlans);
router.post("/plan", planController.createPlan);
router.get("/plan/:id", planController.getPlanById);
router.put("/plan/:id", planController.updatePlan);
router.delete("/plan/:id", planController.deletePlan);

// Admin authentication
router.post("/login", adminController.login);
router.put("/update/password", adminController.updatePassword);

// Job Card History (Admin only)
router.get("/jobcardhistory", adminController.getAllJobCardHistory);

// Garage management (Admin only)
router.get("/allgarages", garageController.getAllGarages);

// Garage Approval (Admin only)
router.get("/garages/pending", adminController.getPendingGarages);
router.put("/garages/approve/:id", adminController.approveGarage);
router.put("/garages/reject/:id", adminController.rejectGarage);

// Insurance management (Admin only)
router.post("/insurance/add", adminController.addInsurance);
router.get("/insurance/expiring", adminController.getExpiringInsurance);

module.exports = router;
