const express = require("express");
const router = express.Router();
const {addPart, getPartsByGarage,updatePart,deletePart} = require("../Controllers/inventory.controller");
const authGarage = require("../Middlewares/garageauth.middleware");

router.use(authGarage);
// Add a new part
router.post("/add", addPart);

// Get all parts for a garage
router.get("/:garageId", getPartsByGarage);

// Update a part
router.put("/update/:partId", updatePart);

// Delete a part (optional)
router.delete("/delete/:partId", deletePart);

module.exports = router;
