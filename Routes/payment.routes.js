const express = require("express");
const router = express.Router();
const paymentController = require("../Controllers/payment.controller");
const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

// Secure all routes with garage auth
router.use(authGarage);

// Create order for garage billing
router.post(
  "/create-order",
  checkPermission("payment:create_order"),
  paymentController.createOrder
);

// Create Razorpay order for garage signup
router.post(
  "/createorderforsignup",
  checkPermission("payment:signup_order"),
  paymentController.createRazorpayOrderForSingUp
);

module.exports = router;
