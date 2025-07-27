const express = require("express");
const {
  createGarage,
  garageLogin,
  garageLogout,
  renewGarageSubscription,
  getGarageById,
  getAllGarages,
  updateGarage,
  deleteGarage,
  getMe,
  updateGarageLogo,
  submitRegistration,
  verifyRegistrationOTP,
  sendRegistrationOTP,
} = require("../Controllers/garage.controller");
const taskController = require("../Controllers/task.controller");
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
// Protected Routes (Require Authentication)
// Garage Management Routes (Role-based Access Control)
router.put("/allgarages/:id", updateGarage);
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
router.post("/task/create", taskController.createTask);

// Update Task
router.put("/task/:taskId", taskController.updateTask);

// Get All Tasks by Garage
router.get("/gettask", taskController.getTasksByGarage);

// Delete Task
router.delete("/task/:taskId", taskController.deleteTask);
// User Management Routes (Role-based Access Control)
router.get("/getme", getMe);
router.post("/create-user", createUser);
router.put("/update-permissions/:id", updatePermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/users", getAllUsers);
router.get("/getusersbygarage", getUserById);
// Nested Routes (e.g., Payment)
module.exports = router;
