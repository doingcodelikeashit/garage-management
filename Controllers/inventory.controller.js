const Inventory = require("../Model/inventory.model");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Add new part
const addPart = async (req, res) => {
  try {
    const {
      garageId,
      carName,
      model,
      partNumber,
      partName,
      quantity,
      purchasePrice,
      sellingPrice,
      taxAmount = 0,
      hsnNumber,
      igst = 0,
      cgstSgst = 0,
    } = req.body;

    if (
      !garageId ||
      !carName ||
      !model ||
      !partNumber ||
      !partName ||
      !quantity ||
      !purchasePrice ||
      !sellingPrice ||
      !hsnNumber
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    const part = new Inventory({
      garageId,
      carName,
      model,
      partNumber,
      partName,
      quantity,
      purchasePrice,
      sellingPrice,
      taxAmount,
      hsnNumber,
      igst,
      cgstSgst,
    });
    const savedPart = await part.save();
    res
      .status(201)
      .json({ message: "Part added successfully", data: savedPart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add part", error: error.message });
  }
};

// Get all parts for a garage
const getPartsByGarage = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    const parts = await Inventory.find({ garageId });
    res.status(200).json(parts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving parts", error: error.message });
  }
};

// Update part
const updatePart = async (req, res) => {
  try {
    const { partId } = req.params;

    // Validate partId
    if (!isValidObjectId(partId)) {
      return res.status(400).json({
        message:
          "Invalid part ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    const {
      carName,
      model,
      partNumber,
      partName,
      quantity,
      purchasePrice,
      sellingPrice,
      taxAmount = 0,
      hsnNumber,
      igst = 0,
      cgstSgst = 0,
    } = req.body;

    const updateFields = {
      carName,
      model,
      partNumber,
      partName,
      quantity,
      purchasePrice,
      sellingPrice,
      taxAmount,
      hsnNumber,
      igst,
      cgstSgst,
    };
    const updated = await Inventory.findByIdAndUpdate(partId, updateFields, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Part not found" });
    }

    res
      .status(200)
      .json({ message: "Part updated successfully", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update part", error: error.message });
  }
};

// Delete part (optional)
const deletePart = async (req, res) => {
  try {
    const { partId } = req.params;

    // Validate partId
    if (!isValidObjectId(partId)) {
      return res.status(400).json({
        message:
          "Invalid part ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    const deletedPart = await Inventory.findByIdAndDelete(partId);

    if (!deletedPart) {
      return res.status(404).json({ message: "Part not found" });
    }

    res.status(200).json({ message: "Part deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete part", error: error.message });
  }
};

// ➤ Get Comprehensive Inventory Report
const getInventoryReport = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { lowStockThreshold = 3 } = req.query; // Default threshold is 3

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Get all parts for the garage
    const parts = await Inventory.find({ garageId }).sort({ partName: 1 });

    // Process parts and calculate totals
    let totalPartsAvailable = 0;
    let totalPurchaseValue = 0;
    let totalSellingValue = 0;
    let lowStockParts = [];
    let outOfStockParts = [];

    const processedParts = parts.map((part) => {
      const partData = part.toObject();

      // Calculate total values for this part
      const totalQuantity = part.quantity || 0;
      const totalPurchaseValueForPart =
        (part.purchasePrice || 0) * totalQuantity;
      const totalSellingValueForPart = (part.sellingPrice || 0) * totalQuantity;

      // Add calculated fields
      partData.totalQuantity = totalQuantity;
      partData.totalPurchaseValue = totalPurchaseValueForPart;
      partData.totalSellingValue = totalSellingValueForPart;
      partData.isLowStock =
        totalQuantity <= lowStockThreshold && totalQuantity > 0;
      partData.isOutOfStock = totalQuantity === 0;

      // Add to totals
      totalPartsAvailable += totalQuantity;
      totalPurchaseValue += totalPurchaseValueForPart;
      totalSellingValue += totalSellingValueForPart;

      // Categorize parts
      if (partData.isLowStock) {
        lowStockParts.push(partData);
      }
      if (partData.isOutOfStock) {
        outOfStockParts.push(partData);
      }

      return partData;
    });

    // Generate report
    const report = {
      garageId,
      reportGeneratedAt: new Date(),
      summary: {
        totalParts: parts.length,
        totalPartsAvailable,
        totalPurchaseValue: parseFloat(totalPurchaseValue.toFixed(2)),
        totalSellingValue: parseFloat(totalSellingValue.toFixed(2)),
        potentialProfit: parseFloat(
          (totalSellingValue - totalPurchaseValue).toFixed(2)
        ),
        lowStockCount: lowStockParts.length,
        outOfStockCount: outOfStockParts.length,
        lowStockThreshold: parseInt(lowStockThreshold),
      },
      lowStockParts,
      outOfStockParts,
      allParts: processedParts,
    };

    res.status(200).json({
      message: "Inventory report generated successfully",
      report,
    });
  } catch (error) {
    console.error("getInventoryReport error:", error);
    res.status(500).json({
      message: "Failed to generate inventory report",
      error: error.message,
    });
  }
};

// ➤ Get Low Stock Alert Report
const getLowStockAlert = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { threshold = 3 } = req.query;

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Find parts with quantity <= threshold
    const lowStockParts = await Inventory.find({
      garageId,
      quantity: { $lte: parseInt(threshold) },
    }).sort({ quantity: 1, partName: 1 });

    const processedParts = lowStockParts.map((part) => {
      const partData = part.toObject();
      partData.totalPurchaseValue =
        (part.purchasePrice || 0) * (part.quantity || 0);
      partData.totalSellingValue =
        (part.sellingPrice || 0) * (part.quantity || 0);
      partData.isOutOfStock = part.quantity === 0;
      return partData;
    });

    const outOfStockParts = processedParts.filter((part) => part.isOutOfStock);
    const criticalStockParts = processedParts.filter(
      (part) => part.quantity > 0 && part.quantity <= parseInt(threshold)
    );

    res.status(200).json({
      message: "Low stock alert generated successfully",
      alert: {
        garageId,
        threshold: parseInt(threshold),
        generatedAt: new Date(),
        summary: {
          totalLowStockParts: processedParts.length,
          outOfStockParts: outOfStockParts.length,
          criticalStockParts: criticalStockParts.length,
        },
        outOfStockParts,
        criticalStockParts,
        allLowStockParts: processedParts,
      },
    });
  } catch (error) {
    console.error("getLowStockAlert error:", error);
    res.status(500).json({
      message: "Failed to generate low stock alert",
      error: error.message,
    });
  }
};

// ➤ Get Inventory Summary Dashboard
const getInventorySummary = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Get all parts
    const parts = await Inventory.find({ garageId });

    // Calculate summary statistics
    let totalParts = 0;
    let totalPurchaseValue = 0;
    let totalSellingValue = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let categories = {};

    parts.forEach((part) => {
      const quantity = part.quantity || 0;
      totalParts += quantity;
      totalPurchaseValue += (part.purchasePrice || 0) * quantity;
      totalSellingValue += (part.sellingPrice || 0) * quantity;

      if (quantity === 0) {
        outOfStockCount++;
      } else if (quantity <= 3) {
        lowStockCount++;
      }

      // Categorize by car model
      const category = part.model || "Unknown";
      if (!categories[category]) {
        categories[category] = {
          count: 0,
          totalValue: 0,
        };
      }
      categories[category].count += quantity;
      categories[category].totalValue += (part.sellingPrice || 0) * quantity;
    });

    const summary = {
      garageId,
      generatedAt: new Date(),
      totalUniqueParts: parts.length,
      totalPartsAvailable: totalParts,
      totalPurchaseValue: parseFloat(totalPurchaseValue.toFixed(2)),
      totalSellingValue: parseFloat(totalSellingValue.toFixed(2)),
      potentialProfit: parseFloat(
        (totalSellingValue - totalPurchaseValue).toFixed(2)
      ),
      lowStockCount,
      outOfStockCount,
      categories: Object.keys(categories).map((category) => ({
        category,
        partsCount: categories[category].count,
        totalValue: parseFloat(categories[category].totalValue.toFixed(2)),
      })),
    };

    res.status(200).json({
      message: "Inventory summary generated successfully",
      summary,
    });
  } catch (error) {
    console.error("getInventorySummary error:", error);
    res.status(500).json({
      message: "Failed to generate inventory summary",
      error: error.message,
    });
  }
};

module.exports = {
  addPart,
  deletePart,
  updatePart,
  getPartsByGarage,
  getInventoryReport,
  getLowStockAlert,
  getInventorySummary,
};
