const express = require("express");
const router = express.Router();
const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  renewSubscription,
  completeRenewal,
  getSubscriptionStatus,
} = require("../Controllers/plan.controller");

const { auth, adminAuth } = require("../Middlewares/auth");

// Plan management routes (Admin only)
router.post("/create", adminAuth(), createPlan);
router.get("/all", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", adminAuth(), updatePlan);
router.delete("/:id", adminAuth(), deletePlan);

// Subscription renewal routes (No auth required for public access)
router.post("/renew", renewSubscription);
router.post("/complete-renewal", completeRenewal);
router.get("/subscription-status/:garageId", getSubscriptionStatus);

module.exports = router;
