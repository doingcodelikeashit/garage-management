const express = require("express");
const router = express.Router();
const billingController = require("../Controllers/billing.controller");
const auth = require("../Middlewares/auth");
const checkPermission = require("../Middlewares/checkpermission");
router.post(
  "/generate/:jobCardId",
  auth(),
  checkPermission("billing:generate"),
  billingController.generateBill
);

// Process payment
router.post(
  "/pay",
  auth(),
  checkPermission("billing:pay"),
  billingController.processPayment
);

// Get invoice
router.get(
  "/invoice",
  auth(),
  checkPermission("billing:invoice"),
  billingController.getInvoice
);
module.exports = router;
