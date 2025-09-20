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

// Get last invoice number for garage
router.get("/last-invoice/:garageId", billingController.getLastInvoiceNumber);

// Get financial report for garage
router.get("/financial-report/:garageId", billingController.getFinancialReport);

// Send bill PDF via email
router.post("/send-email/:billId", billingController.sendBillEmail);

module.exports = router;
