const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const {
  createUser,
  updatePermissions,
  deleteUser,
  getAllUsers,
} = require("../Controllers/superadmin.controller");

router.use(auth("super-admin")); // Protect all routes

router.post("/create-user", createUser);
router.put("/update-permissions/:id", updatePermissions);
router.delete("/delete-user/:id", deleteUser);
router.get("/users", getAllUsers);

module.exports = router;
