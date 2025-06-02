const express = require("express");
const {
  createGarage,
  garageLogin,
  getGarageById,
  getAllGarages,
  updateGarage,
  deleteGarage,
  getMe,
} = require("../Controllers/garage.controller");

const authGarage = require("../Middlewares/garageauth.middleware");
const checkPermission = require("../Middlewares/checkpermission");

const router = express.Router();
const {
  createUser,
  userLogin,
  updatePermissions,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserPermissions,
} = require("../Controllers/superadmin.controller");
const billingController = require("../Controllers/billing.controller");

// Engineer Controllers
const {
  createEngineer,
  getEngineersByGarage,
  updateEngineer,
  deleteEngineer,
} = require("../Controllers/engineer.controller");

// Inventory Controllers
const {
  addPart,
  getPartsByGarage,
  updatePart,
  deletePart,
} = require("../Controllers/inventory.controller");
const adminController = require("../Controllers/admin.controller");
const upload = require("../Middlewares/upload");
// JobCard Controllers
const {
  getJobCardsByGarage,
  createJobCard,
  getJobCardById,
  updateJobCard,
  deleteJobCard,
  assignEngineer,
  logWorkProgress,
  qualityCheckByEngineer,
} = require("../Controllers/jobCard.controller");
const auth = require("../Middlewares/auth");
// Public Route
router.post("/login", garageLogin);
router.post("/create", createGarage);
router.use("/payment", require("./payment.routes"));
router.post("/user/login", userLogin);
router.get("/user/getpermission", auth(), getUserPermissions);
router.get("/getgaragebyid/:id", getGarageById);
// Protected Routes (Require Authentication)
// Garage Management Routes (Role-based Access Control)
// router.put("/allgarages/:id", checkPermission("garage:update"), updateGarage);
router.delete(
  "/allgarages/:id",
  // checkPermission("garage:delete"),
  deleteGarage
);
router.post("/billing/generate/:jobCardId", billingController.generateBill);
router.post("/billing/pay", billingController.processPayment);
router.get("/billing/invoice", billingController.getInvoice);

router.post("/engineers/add", createEngineer);
router.get("/engineers/:garageId", getEngineersByGarage);
router.put("/engineers/:engineerId", updateEngineer);
router.delete("/engineers/:engineerId", deleteEngineer);

router.post("/inventory/add", addPart);
router.get("/inventory/:garageId", getPartsByGarage);
router.put("/inventory/update/:partId", updatePart);
router.delete("/inventory/delete/:partId", deletePart);

router.get("/jobcards/garage/:garageId", getJobCardsByGarage);
router.post(
  "/jobcards/add",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createJobCard
);
router.get("/jobcards/:jobCardId", getJobCardById);
router.put("/jobcards/:jobCardId", updateJobCard);
router.delete("/jobcards/:jobCardId", deleteJobCard);
router.put("/jobcards/assign-engineer/:jobCardId", assignEngineer);
router.put("/jobcards/:jobCardId/workprogress", logWorkProgress);
router.put("/jobcards/:jobCardId/qualitycheck", qualityCheckByEngineer);

router.post("/insurance/add", adminController.addInsurance);

router.get("/insurance/expiring", adminController.getExpiringInsurance);
router.use(authGarage);
// User Management Routes (Role-based Access Control)
router.get("/getme", getMe);
router.post("/create-user", createUser);
router.put("/update-permissions/:id", updatePermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/users", getAllUsers);
router.get("/getusersbygarage", getUserById);
// Nested Routes (e.g., Payment)
module.exports = router;
