const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./Config/db");
const reminderRoutes = require("./Routes/reminder.routes");
const superadminRoutes = require("./Routes/superadmin.routes");
const garageRoutes = require("./Routes/garage.routes");
const engineerRoutes = require("./Routes/engineer.routes");
const jobRoutes = require("./Routes/jobCard.routes");
const inventoryRoutes = require("./Routes/inventory.routes");
const adminRoutes = require("./Routes/admin.routes");

app.use(cors());
app.use(express.json());

app.use("/api/garage", garageRoutes);
app.use("/api/engineers", engineerRoutes);
app.use("/api/jobcards", jobRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/history", historyRoutes);
app.use("/api/billing", require("./Routes/billing.routes"));
app.use("/api/reminders", reminderRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/uploads", express.static("uploads")); // So you can access files (images) via URL

const PORT = 8000;

app.get("/", (req, res) => {
  res.status(200).send("Home Page");
});

const startServer = async () => {
  try {
    await connection(); // Ensure DB is connected first
    app.listen(PORT, () => {
      console.log("Welcome to server");
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1); // Exit the app if DB is dead
  }
};

startServer();
