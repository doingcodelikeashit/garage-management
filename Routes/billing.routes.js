const express = require("express");
const router = express.Router();
const billingController = require("../Controllers/billing.controller");
const { auth } = require("../Middlewares/auth");

// Generate bill
router.post("/generate/:jobCardId", billingController.generateBill);

// Process payment
router.post("/pay", billingController.processPayment);

// Get invoice
router.get("/invoice", billingController.getInvoice);

module.exports = router;
