const JobCard = require("../Model/jobCard.model");
const Garage = require("../Model/garage.model");
const Engineer = require("../Model/engineer.model");

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
      insuranceProvider,
      policyNumber,
      expiryDate,
      registrationNumber,
      type,
      excessAmount,
      jobDetails,
    } = req.body;

    const images = req.files?.images?.map((file) => file.path) || [];
    const video = req.files?.video?.[0]?.path || null;

    console.log("files :", req.files);

    if (!req.files.images) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Validate garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found , test" });
    }

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
      insuranceProvider,
      policyNumber,
      expiryDate,
      registrationNumber,
      type,
      excessAmount,
      jobDetails,
      images,
      video,
      status: "In Progress",
      engineerId: null,
    });

    await newJobCard.save();
    res
      .status(201)
      .json({ message: "Job Card created successfully", jobCard: newJobCard });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Get All Job Cards (For a Specific Garage)
const getJobCardsByGarage = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Check if garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found , test two" });
    }

    const jobCards = await JobCard.find({ garageId }).populate(
      "engineerId",
      "name"
    );
    res.status(200).json(jobCards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Get a Single Job Card by ID
const getJobCardById = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const jobCard = await JobCard.findById(jobCardId).populate(
      "engineerId",
      "name"
    );

    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    res.status(200).json(jobCard);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Update Job Card Details
const updateJobCard = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const updates = req.body; // Fields to update

    const jobCard = await JobCard.findByIdAndUpdate(jobCardId, updates, {
      new: true,
    });

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
    const jobCard = await JobCard.findByIdAndDelete(jobCardId);

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

    // Find Job Card
    const jobCard = await JobCard.findById(jobCardId);
    if (!jobCard) {
      return res.status(404).json({ message: "Job Card not found" });
    }

    // Check if Engineer Exists and belongs to the same garage
    const engineer = await Engineer.findOne({
      _id: engineerId,
      garageId: jobCard.garageId,
    });
    if (!engineer) {
      return res
        .status(403)
        .json({ message: "Engineer not found in this garage" });
    }

    jobCard.engineerId = engineerId;
    await jobCard.save();

    res
      .status(200)
      .json({ message: "Engineer assigned successfully", jobCard });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ➤ Update Job Status (In Progress, Completed, Pending, Cancelled)
// const updateJobStatus = async (req, res) => {
//   try {
//     const { jobCardId } = req.params;
//     const { status } = req.body;

//     const jobCard = await JobCard.findById(jobCardId);
//     if (!jobCard) {
//       return res.status(404).json({ message: "Job Card not found" });
//     }

//     jobCard.status = status;
//     await jobCard.save();

//     res.status(200).json({ message: "Job status updated successfully", jobCard });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

const logWorkProgress = async (req, res) => {
  try {
    const { jobCardId } = req.params;
    const { partsUsed, laborHours, engineerRemarks, status } = req.body;

    const jobCard = await JobCard.findById(jobCardId);
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

    const jobCard = await JobCard.findById(jobCardId);
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
  getJobCardsByGarage,
  getJobCardById,
  updateJobCard,
  deleteJobCard,
  assignEngineer,
  // updateJobStatus,
  logWorkProgress,
  qualityCheckByEngineer,
};
