const JobCard = require("../Model/jobCard.model");
const Garage = require("../Model/garage.model");
const Engineer = require("../Model/engineer.model");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ➤ Create a Job Card (Engineer not assigned initially)
// const createJobCard = async (req, res) => {
//   try {
//     const { garageId, customerNumber, customerName, contactNumber, email, company, carNumber, model, kilometer, fuelType, insuranceProvider, policyNumber, expiryDate, registrationNumber, type, excessAmount, jobDetails, images, video } = req.body;

//     // Check if garage exists
//     const garage = await Garage.findById(garageId);
//     if (!garage) {
//       return res.status(404).json({ message: "Garage not found" });
//     }

//     const newJobCard = new JobCard({
//       garageId,
//       customerNumber,
//       customerName,
//       contactNumber,
//       email,
//       company,
//       carNumber,
//       model,
//       kilometer,
//       fuelType,
//       insuranceProvider,
//       policyNumber,
//       expiryDate,
//       registrationNumber,
//       type,
//       excessAmount,
//       jobDetails,
//       images,
//       video,
//       status: "In Progress",  // Default status
//       engineerId: null  // Engineer will be assigned later
//     });

//     await newJobCard.save();
//     res.status(201).json({ message: "Job Card created successfully", jobCard: newJobCard });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

const createJobCard = async (req, res) => {
  try {
    const {
      garageId,
      customerNumber,
      customerName,
      contactNumber,
      email,
      company,
      carNumber,
      model,
      kilometer,
      fuelType,
      fuelLevel, // Added fuel level
      insuranceProvider,
      policyNumber,
      expiryDate,
      registrationNumber,
      type, // jobType
      jobDetails, // price removed from here
      // excessAmount removed as required
    } = req.body;

    const images = req.files?.images?.map((file) => file.path) || [];
    const video = req.files?.video?.[0]?.path || null;

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({ message: "Invalid garage ID format" });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Verify that the authenticated garage matches the garageId in request
    if (req.garage._id.toString() !== garageId) {
      return res.status(403).json({
        message: "You can only create job cards for your own garage.",
      });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Generate jobId (e.g., JC-<timestamp>)
    const jobId = `JC-${Date.now()}`;
    const createdBy = req.garage._id; // Use garage ID as creator

    const newJobCard = new JobCard({
      garageId,
      customerNumber,
      customerName,
      contactNumber,
      email,
      company,
      carNumber,
      model,
      kilometer,
      fuelType,
      fuelLevel, // Added
      insuranceProvider,
      policyNumber,
      expiryDate,
      registrationNumber,
      type, // jobType
      jobDetails, // price removed
      images, // These are Cloudinary URLs
      video, // Also Cloudinary URL
      status: "In Progress",
      engineerId: null,
      jobId, // Added jobId
      createdBy, // Track creator (garage ID)
    });

    await newJobCard.save();

    // Populate creator info for response
    const populatedJobCard = await JobCard.findById(newJobCard._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json({
      message: "Job Card created successfully",
      jobCard: populatedJobCard,
    });
  } catch (error) {
    console.error("createJobCard error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const updateGenerateBillStatus = async (req, res) => {
  try {
    const { jobCardId } = req.params;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({ message: "Invalid job card ID format" });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    });
    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    jobCard.generateBill = true;
    await jobCard.save();

    // Populate creator info for response
    const populatedJobCard = await JobCard.findById(jobCard._id).populate(
      "createdBy",
      "name email"
    );

    res.status(200).json({
      message: "Job Card bill status updated to true",
      jobCard: populatedJobCard,
    });
  } catch (error) {
    console.error("Error updating bill status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ➤ Get All Job Cards (For a Specific Garage)
const getJobCardsByGarage = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Validate garageId
    if (!isValidObjectId(garageId)) {
      return res.status(400).json({
        message:
          "Invalid garage ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Verify that the authenticated garage matches the garageId in request
    if (req.garage._id.toString() !== garageId) {
      return res.status(403).json({
        message: "You can only view job cards for your own garage.",
      });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Since we're using garage authentication, all job cards belong to this garage
    const filter = { garageId };

    const jobCards = await JobCard.find(filter)
      .populate("engineerId", "name")
      .populate("createdBy", "name email"); // Populate creator info
    res.status(200).json(jobCards);
  } catch (error) {
    console.error("getJobCardsByGarage error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Get a Single Job Card by ID
const getJobCardById = async (req, res) => {
  try {
    const { jobCardId } = req.params;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find job card and verify it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    })
      .populate("engineerId", "name")
      .populate("createdBy", "name email"); // Populate creator info

    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    res.status(200).json(jobCard);
  } catch (error) {
    console.error("getJobCardById error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Update Job Card Details
const updateJobCard = async (req, res) => {
  try {
    const { jobCardId } = req.params;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    const updates = req.body; // Fields to update

    // Only allow updating allowed fields
    const allowedFields = [
      "customerNumber",
      "customerName",
      "contactNumber",
      "email",
      "company",
      "carNumber",
      "model",
      "kilometer",
      "fuelType",
      "fuelLevel",
      "insuranceProvider",
      "policyNumber",
      "expiryDate",
      "registrationNumber",
      "type",
      "jobDetails",
      "images",
      "video",
      "status",
      "engineerId",
    ];
    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    // Find and update job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOneAndUpdate(
      { _id: jobCardId, garageId: req.garage._id },
      filteredUpdates,
      { new: true }
    );

    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    res.status(200).json({ message: "Job Card updated successfully", jobCard });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Delete a Job Card
const deleteJobCard = async (req, res) => {
  try {
    const { jobCardId } = req.params;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find and delete job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOneAndDelete({
      _id: jobCardId,
      garageId: req.garage._id,
    });

    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    res.status(200).json({ message: "Job Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Assign an Engineer to a Job Card
const assignEngineer = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const { engineerId } = req.body;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Validate input
    if (!Array.isArray(engineerId) || engineerId.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of engineerIds" });
    }

    // Validate each engineerId
    for (const id of engineerId) {
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          message: `Invalid engineer ID format: ${id}. Please provide a valid 24-character ObjectId.`,
        });
      }
    }

    // Find Job Card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    });
    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    // Validate Engineers and garage match
    const engineers = await Engineer.find({
      _id: { $in: engineerId },
      garageId: req.garage._id,
    });

    if (engineers.length !== engineerId.length) {
      return res
        .status(403)
        .json({ message: "Some engineers are invalid or not in this garage" });
    }

    // Assign Engineers
    jobCard.engineerId = engineerId;
    await jobCard.save();

    res.status(200).json({
      message: "Engineers assigned successfully",
      jobCard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const assignJobCardsToEngineer = async (req, res) => {
  try {
    const { engineerId } = req.params;
    const { jobCardIds } = req.body;

    // Validate engineerId
    if (!isValidObjectId(engineerId)) {
      return res.status(400).json({
        message:
          "Invalid engineer ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    if (!Array.isArray(jobCardIds) || jobCardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide an array of jobCardIds" });
    }

    // Validate each jobCardId
    for (const id of jobCardIds) {
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          message: `Invalid job card ID format: ${id}. Please provide a valid 24-character ObjectId.`,
        });
      }
    }

    const engineer = await Engineer.findOne({
      _id: engineerId,
      garageId: req.garage._id,
    });
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    // Update JobCards to include this engineer, ensuring they belong to the authenticated garage
    await JobCard.updateMany(
      { _id: { $in: jobCardIds }, garageId: req.garage._id },
      { $set: { engineerId: engineerId } }
    );

    // Optional: Update Engineer to include jobCards (if using assignedJobCards field)
    await Engineer.findByIdAndUpdate(engineerId, {
      $addToSet: { assignedJobCards: { $each: jobCardIds } },
    });

    res.status(200).json({ message: "Job Cards assigned to engineer" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// ➤ Update Job Status (In Progress, Completed, Pending, Cancelled)
const updateJobStatus = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const { status } = req.body;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    });
    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    jobCard.status = status;
    await jobCard.save();

    res
      .status(200)
      .json({ message: "Job status updated successfully", jobCard });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const logWorkProgress = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const { partsUsed, laborHours, engineerRemarks, status } = req.body;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    });
    if (!jobCard)
      return res.status(404).json({ message: "Job Card not found" });

    if (partsUsed) jobCard.partsUsed = partsUsed;
    if (laborHours) jobCard.laborHours = laborHours;
    if (engineerRemarks) jobCard.engineerRemarks = engineerRemarks;
    if (
      status &&
      ["In Progress", "Completed", "Pending", "Cancelled"].includes(status)
    ) {
      jobCard.status = status;
    }

    await jobCard.save();
    res.status(200).json({ message: "Work progress updated", jobCard });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

const qualityCheckByEngineer = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const { notes } = req.body;

    // Validate jobCardId
    if (!isValidObjectId(jobCardId)) {
      return res.status(400).json({
        message:
          "Invalid job card ID format. Please provide a valid 24-character ObjectId.",
      });
    }

    // Check if req.garage exists (from garage authentication)
    if (!req.garage || !req.garage._id) {
      return res.status(401).json({
        message:
          "Authentication required. Please provide a valid garage JWT token.",
      });
    }

    // Find job card, ensuring it belongs to the authenticated garage
    const jobCard = await JobCard.findOne({
      _id: jobCardId,
      garageId: req.garage._id,
    });
    if (!jobCard)
      return res.status(404).json({ message: "Job Card not found" });

    if (!jobCard.engineerId) {
      return res
        .status(400)
        .json({ message: "No engineer assigned to perform quality check" });
    }

    if (jobCard.qualityCheck && jobCard.qualityCheck.doneBy) {
      return res
        .status(409)
        .json({ message: "Quality Check already completed" });
    }

    jobCard.qualityCheck = {
      doneBy: jobCard.engineerId,
      notes: notes || "No remarks",
      date: new Date(),
      billApproved: true,
    };

    await jobCard.save();
    res.status(200).json({ message: "Quality Check completed", jobCard });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
module.exports = {
  createJobCard,
  updateGenerateBillStatus,
  getJobCardsByGarage,
  getJobCardById,
  updateJobCard,
  deleteJobCard,
  assignEngineer,
  assignJobCardsToEngineer,
  updateJobStatus,
  logWorkProgress,
  qualityCheckByEngineer,
};
