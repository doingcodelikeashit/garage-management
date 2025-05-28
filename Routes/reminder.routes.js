const express = require("express");
const router = express.Router();
const { sendServiceReminder } = require("../Controllers/reminder.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

// router.use(authGarage);

// Send service reminder (requires proper permission)
router.post("/send", checkPermission("reminder:send"), sendServiceReminder);

module.exports = router;
