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
const auth = require("../Middlewares/auth");

const router = express.Router();

// router.use(authGarage);

// Get all Job Cards for a Garage
router.get(
  "/garage/:garageId",
  auth(["super-admin", "admin", "manager", "staff"]),
  // checkPermission("jobcard:view"),
  getJobCardsByGarage
);

// Create Job Card with images
router.post(
  "/add",
  auth(["super-admin", "admin", "manager", "staff"]),
  // checkPermission("jobcard:create"),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createJobCard
);
router.put(
  "/updatebillstatus/:jobCardId",
  auth(["super-admin", "admin", "manager", "staff"]),
  updateGenerateBillStatus
);
router.put(
  "/updatestatus/:jobCardId",
  auth(["super-admin", "admin", "manager", "staff"]),
  updateJobStatus
);

// Get Single Job Card
router.get(
  "/:jobCardId",
  auth(["super-admin", "admin", "manager", "staff"]),
  getJobCardById
);

// Update Job Card
router.put(
  "/:jobCardId",
  auth(["super-admin", "admin", "manager", "staff"]),
  updateJobCard
);

// Delete Job Card
router.delete(
  "/:jobCardId",
  auth(["super-admin", "admin", "manager", "staff"]),
  deleteJobCard
);

// Assign Engineer
router.put(
  "/assign-engineer/:jobCardId",
  auth(["super-admin", "admin", "manager"]),
  // checkPermission("jobcard:assign_engineer"),
  assignEngineer
);
router.put(
  "/assign-jobcards/:engineerId",
  auth(["super-admin", "admin", "manager"]),
  // checkPermission("jobcard:assign_engineer"),
  assignJobCardsToEngineer
);

// Log Work Progress
router.put(
  "/jobcard/:jobCardId/workprogress",
  auth(["super-admin", "admin", "manager", "staff"]),
  // checkPermission("jobcard:log_work"),
  logWorkProgress
);

// Quality Check
router.put(
  "/jobcard/:jobCardId/qualitycheck",
  auth(["super-admin", "admin", "manager", "staff"]),
  // checkPermission("jobcard:quality_check"),
  qualityCheckByEngineer
);

module.exports = router;
