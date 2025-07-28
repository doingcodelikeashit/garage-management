const express = require("express");
const router = express.Router();
const {
  addPart,
  getPartsByGarage,
  updatePart,
  deletePart,
  getInventoryReport,
  getLowStockAlert,
  getInventorySummary,
} = require("../Controllers/inventory.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

// router.use(authGarage);

// Add a new part
router.post("/add", addPart);

// Get all parts for a garage
router.get(
  "/:garageId",
  /*checkPermission("inventory:view"),*/ getPartsByGarage
);

// Update a part
router.put("/update/:partId", updatePart);

// Delete a part (optional)
router.delete(
  "/delete/:partId",
  // checkPermission("inventory:delete"),
  deletePart
);

// ➤ Inventory Reports and Analytics
// Get comprehensive inventory report
router.get("/report/:garageId", getInventoryReport);

// Get low stock alert report
router.get("/low-stock/:garageId", getLowStockAlert);

// Get inventory summary dashboard
router.get("/summary/:garageId", getInventorySummary);

module.exports = router;
