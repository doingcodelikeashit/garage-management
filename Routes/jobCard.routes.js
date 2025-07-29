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
  getNextJobCardNumber,
} = require("../Controllers/jobCard.controller");

const upload = require("../Middlewares/upload");
const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();

// Get all Job Cards for a Garage
router.get("/garage/:garageId", getJobCardsByGarage);

// Get next job card number for a garage
router.get("/next-number/:garageId", getNextJobCardNumber);

// Create Job Card with images (KEEP AUTH)
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

router.put("/updatestatus/:jobCardId", updateJobStatus);

// Get Single Job Card
router.get("/:jobCardId", getJobCardById);

// Update Job Card
router.put("/:jobCardId", updateJobCard);

// Delete Job Card
router.delete("/:jobCardId", deleteJobCard);

// Assign Engineer
router.put("/assign-engineer/:jobCardId", assignEngineer);

router.put("/assign-jobcards/:engineerId", assignJobCardsToEngineer);

// Log Work Progress
router.put("/jobcard/:jobCardId/workprogress", logWorkProgress);

// Quality Check
router.put("/jobcard/:jobCardId/qualitycheck", qualityCheckByEngineer);

module.exports = router;
