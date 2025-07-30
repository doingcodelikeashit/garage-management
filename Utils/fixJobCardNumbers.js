const mongoose = require("mongoose");
const JobCard = require("../Model/jobCard.model");
const db = require("../Config/db");

// Connect to database
db();

const fixJobCardNumbers = async () => {
  try {
    console.log("Starting job card number fix...");

    // Get all job cards grouped by garage
    const jobCards = await JobCard.find({}).sort({ garageId: 1, createdAt: 1 });

    const garageGroups = {};

    // Group job cards by garage
    jobCards.forEach((jobCard) => {
      const garageId = jobCard.garageId.toString();
      if (!garageGroups[garageId]) {
        garageGroups[garageId] = [];
      }
      garageGroups[garageId].push(jobCard);
    });

    let fixedCount = 0;

    // Fix job card numbers for each garage
    for (const [garageId, cards] of Object.entries(garageGroups)) {
      console.log(
        `Processing garage ${garageId} with ${cards.length} job cards`
      );

      for (let i = 0; i < cards.length; i++) {
        const jobCard = cards[i];
        const expectedNumber = i + 1;

        // Check if job card number is missing or incorrect
        if (
          !jobCard.jobCardNumber ||
          jobCard.jobCardNumber !== expectedNumber
        ) {
          console.log(
            `Fixing job card ${jobCard._id}: ${
              jobCard.jobCardNumber || "missing"
            } -> ${expectedNumber}`
          );

          await JobCard.findByIdAndUpdate(jobCard._id, {
            jobCardNumber: expectedNumber,
          });

          fixedCount++;
        }
      }
    }

    console.log(`Fixed ${fixedCount} job card numbers`);

    // Verify the fix
    const invalidCards = await JobCard.find({
      $or: [
        { jobCardNumber: { $exists: false } },
        { jobCardNumber: null },
        { jobCardNumber: { $lt: 1 } },
      ],
    });

    if (invalidCards.length === 0) {
      console.log("✅ All job cards now have valid numbers!");
    } else {
      console.log(
        `❌ Found ${invalidCards.length} job cards still with invalid numbers`
      );
    }
  } catch (error) {
    console.error("Error fixing job card numbers:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the fix if this script is executed directly
if (require.main === module) {
  fixJobCardNumbers();
}

module.exports = fixJobCardNumbers;
