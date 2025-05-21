const express = require("express");
const { createEngineer, getEngineersByGarage, updateEngineer, deleteEngineer } = require("../Controllers/engineer.controller");
const authGarage = require("../Middlewares/garageauth.middleware");

const router = express.Router();

router.use(authGarage);
// Engineer CRUD Routes
router.post("/add", createEngineer); // Add engineer
router.get("/:garageId", getEngineersByGarage); // Get engineers for a specific garage
router.put("/:engineerId", updateEngineer); // Update engineer details
router.delete("/:engineerId", deleteEngineer); // Delete engineer

module.exports = router;
