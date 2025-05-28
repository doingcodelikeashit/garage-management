const express = require("express");
const {
  createEngineer,
  getEngineersByGarage,
  updateEngineer,
  deleteEngineer,
} = require("../Controllers/engineer.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission"); // Optional if permissions are needed

const router = express.Router();

// Use garage authentication middleware
// router.use(authGarage);

// Engineer CRUD Routes
router.post(
  "/add",
  checkPermission("engineer:add"), // Optional
  createEngineer
);

router.get(
  "/:garageId",
  checkPermission("engineer:view"), // Optional
  getEngineersByGarage
);

router.put(
  "/:engineerId",
  checkPermission("engineer:update"), // Optional
  updateEngineer
);

router.delete(
  "/:engineerId",
  checkPermission("engineer:delete"), // Optional
  deleteEngineer
);

module.exports = router;
