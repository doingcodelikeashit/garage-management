const express = require("express");
const router = express.Router();
const billingController = require("../Controllers/billing.controller");
const { auth } = require("../Middlewares/auth");

// Generate bill
router.post("/generate/:jobCardId", auth(), billingController.generateBill);

// Process payment
router.post("/pay", auth(), billingController.processPayment);

// Get invoice
router.get("/invoice", auth(), billingController.getInvoice);

module.exports = router;
