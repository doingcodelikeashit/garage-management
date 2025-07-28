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

const auth = require("../Middlewares/auth");

// Plan management routes (Admin only)
router.post("/create", auth(["super-admin", "admin"]), createPlan);
router.get("/all", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", auth(["super-admin", "admin"]), updatePlan);
router.delete("/:id", auth(["super-admin", "admin"]), deletePlan);

// Subscription renewal routes
router.post("/renew", renewSubscription);
router.post("/complete-renewal", completeRenewal);
router.get("/subscription-status/:garageId", getSubscriptionStatus);

module.exports = router;
