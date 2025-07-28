const express = require("express");
const {
  createJobCard,
  getJobCardsByGarage,
  getJobCardById,
  updateJobCard,
  deleteJobCard,
  assignEngineer,
  assignJobCardsToEngineer,
  logWorkProgress,
  qualityCheckByEngineer,
  updateJobStatus,
  updateGenerateBillStatus,
} = require("../Controllers/jobCard.controller");

const upload = require("../Middlewares/upload");
const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();

// Get all Job Cards for a Garage
router.get("/garage/:garageId", authGarage, getJobCardsByGarage);

// Create Job Card with images
router.post(
  "/add",
  authGarage,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createJobCard
);

router.put(
  "/updatebillstatus/:jobCardId",
  authGarage,
  updateGenerateBillStatus
);

router.put("/updatestatus/:jobCardId", authGarage, updateJobStatus);

// Get Single Job Card
router.get("/:jobCardId", authGarage, getJobCardById);

// Update Job Card
router.put("/:jobCardId", authGarage, updateJobCard);

// Delete Job Card
router.delete("/:jobCardId", authGarage, deleteJobCard);

// Assign Engineer
router.put("/assign-engineer/:jobCardId", authGarage, assignEngineer);

router.put(
  "/assign-jobcards/:engineerId",
  authGarage,
  assignJobCardsToEngineer
);

// Log Work Progress
router.put("/jobcard/:jobCardId/workprogress", authGarage, logWorkProgress);

// Quality Check
router.put(
  "/jobcard/:jobCardId/qualitycheck",
  authGarage,
  qualityCheckByEngineer
);

module.exports = router;
