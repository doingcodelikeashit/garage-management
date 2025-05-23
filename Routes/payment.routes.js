const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/payment.controller");
const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

// Secure all routes with garage auth
router.use(authGarage);

// Create order for garage billing
router.post("/create-order", paymentController.createOrder);

// Create Razorpay order for garage signup
router.post(
  "/createorderforsignup",
  paymentController.createRazorpayOrderForSingUp
);

module.exports = router;
