const express = require("express");
const router = express.Router();
const garageController = require("../Controllers/garage.controller");
const {
  garageLogin,
  garageLogout,
  createGarage,
  submitRegistration,
  verifyRegistrationOTP,
  sendRegistrationOTP,
  renewGarageSubscription,
  updateGarageLogo,
  getAllGarages,
  getMe,
  getGarageById,
  updateGarage,
  deleteGarage,
  getGarageIdByEmail,
  testEmailSend,
} = garageController;

// Import user-related functions from superadmin controller
const {
  createUser,
  userLogin,
  getUserPermissions,
  updatePermissions,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../Controllers/superadmin.controller");

const billingController = require("../Controllers/billing.controller");
const taskController = require("../Controllers/task.controller");
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
const { auth, adminAuth } = require("../Middlewares/auth");
const authGarage = require("../Middlewares/garageauth.middleware");
const hybridAuth = require("../Middlewares/hybridAuth");

// Public Route
router.post("/login", garageLogin);
router.post("/logout/:garageId", garageLogout);
router.post("/create", upload.single("logo"), createGarage);
router.post("/submit-registration", submitRegistration);
router.post("/verify-registration", verifyRegistrationOTP);
router.post("/resend-otp", sendRegistrationOTP);
router.put("/updatelogo/:id", upload.single("logo"), updateGarageLogo);
router.post("/renewplan/:garageId", renewGarageSubscription);
router.use("/payment", require("./payment.routes"));
router.post("/user/login", userLogin);
router.get("/user/getpermission", auth(), getUserPermissions);
router.get("/getgaragebyid/:id", getGarageById);

// Get Garage ID by Email
router.get("/get-garage-id/:email", getGarageIdByEmail);

// SMTP test endpoint
router.get("/test-email", testEmailSend);

// Protected Routes (Require Authentication)
// Garage Management Routes
router.put("/allgarages/:id", updateGarage);
router.delete("/allgarages/:id", deleteGarage);

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
  hybridAuth,
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

// Task routes (using hybrid auth for user/garage access)
router.post("/task/create", hybridAuth, taskController.createTask);
router.put("/task/:taskId", taskController.updateTask);
router.get("/gettask", hybridAuth, taskController.getTasksByGarage);
router.delete("/task/:taskId", taskController.deleteTask);

// User Management Routes (Admin only)
router.get("/getme", authGarage, getMe);
router.post("/create-user", authGarage, createUser); // KEEP AUTH
router.put("/update-permissions/:id", updatePermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/users", getAllUsers);
router.get("/getusersbygarage", authGarage, getUserById);

module.exports = router;
