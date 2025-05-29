const express = require("express");
const {
  createJobCard,
  getJobCardsByGarage,
  getJobCardById,
  updateJobCard,
  deleteJobCard,
  assignEngineer,
  logWorkProgress,
  qualityCheckByEngineer,
} = require("../Controllers/jobCard.controller");

const upload = require("../Middlewares/upload");
const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();

// router.use(authGarage);

// Get all Job Cards for a Garage
router.get(
  "/garage/:garageId",
  // checkPermission("jobcard:view"),
  getJobCardsByGarage
);

// Create Job Card with images
router.post(
  "/add",
  // checkPermission("jobcard:create"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createJobCard
);

// Get Single Job Card
router.get("/:jobCardId", getJobCardById);

// Update Job Card
router.put("/:jobCardId", updateJobCard);

// Delete Job Card
router.delete("/:jobCardId", deleteJobCard);

// Assign Engineer
router.put(
  "/assign-engineer/:jobCardId",
  // checkPermission("jobcard:assign_engineer"),
  assignEngineer
);

// Log Work Progress
router.put(
  "/jobcard/:jobCardId/workprogress",
  // checkPermission("jobcard:log_work"),
  logWorkProgress
);

// Quality Check
router.put(
  "/jobcard/:jobCardId/qualitycheck",
  // checkPermission("jobcard:quality_check"),
  qualityCheckByEngineer
);

module.exports = router;
