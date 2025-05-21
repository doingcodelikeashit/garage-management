const express = require("express");
const router = express.Router();
const billingController = require("../Controllers/billing.controller");

router.post("/generate/:jobCardId", billingController.generateBill);
router.post("/pay", billingController.processPayment);
router.get("/invoice", billingController.getInvoice);

module.exports = router;
