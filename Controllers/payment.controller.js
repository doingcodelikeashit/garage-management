const razorpay = require("../Utils/razorpay");

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRazorpayOrderForSingUp = async (req, res) => {
  try {
    const { amount, subscriptionType } = req.body;

    if (!["3_months", "6_months", "1_year"].includes(subscriptionType)) {
      return res.status(400).json({ message: "Invalid subscription type" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay works in paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};
