const express = require("express");
const router = express.Router();
const { sendServiceReminder } = require("../Controllers/reminder.controller");
const authGarage = require("../Middlewares/garageauth.middleware");

router.use(authGarage);
router.post("/send", sendServiceReminder);

module.exports = router;