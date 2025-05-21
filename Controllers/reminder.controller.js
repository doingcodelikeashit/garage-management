// controllers/reminder.controller.js
const JobCard = require("../Model/jobCard.model"); // Update path as needed
const sendEmail = require("../Utils/mailer");

const sendServiceReminder = async (req, res) => {
  try {
    const { carNumber, reminderDate, message } = req.body;

    const jobCard = await JobCard.findOne({ carNumber, status: "Completed" });

    if (!jobCard) {
      return res.status(404).json({ error: "Completed job card not found for this car." });
    }

    const completedDate = new Date(jobCard.updatedAt || jobCard.createdAt);
    const today = new Date();

    const daysPassed = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));

    if (daysPassed < 45) {
      return res.status(400).json({ message: `Reminder can only be sent after 45 days of service. (${45 - daysPassed} days left)` });
    }

    const emailBody = message || `Dear ${jobCard.customerName}, your car (${carNumber}) is due for service on ${reminderDate}. Please schedule your visit.`;

    await sendEmail(jobCard.email, "Service Reminder", emailBody);

    return res.status(200).json({ message: "Service reminder email sent successfully." });

  } catch (error) {
    console.error("Reminder error:", error);
    return res.status(500).json({ error: "Failed to send service reminder." });
  }
};

module.exports = { sendServiceReminder };
