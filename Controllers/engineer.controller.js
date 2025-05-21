const Engineer = require("../Model/engineer.model");
const Garage = require("../Model/garage.model");

// ➤ Create Engineer (Only Garage Admin Can Add)
const createEngineer = async (req, res) => {
  try {
    const { name, email, phone, garageId } = req.body;

    // Check if garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    // Check if engineer already exists with the same email
    const existingEngineer = await Engineer.findOne({ email });
    if (existingEngineer) {
      return res.status(400).json({ message: "Engineer already exists" });
    }

    const newEngineer = new Engineer({ name, email, phone, garageId });
    await newEngineer.save();

    res.status(201).json({ message: "Engineer added successfully", engineer: newEngineer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Get All Engineers for a Garage
const getEngineersByGarage = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Check if garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    const engineers = await Engineer.find({ garageId });
    res.status(200).json({ engineers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Update Engineer Details
const updateEngineer = async (req, res) => {
  try {
    const { engineerId } = req.params;
    const updates = req.body;

    const engineer = await Engineer.findByIdAndUpdate(engineerId, updates, { new: true });
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.status(200).json({ message: "Engineer updated successfully", engineer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Delete Engineer
const deleteEngineer = async (req, res) => {
  try {
    const { engineerId } = req.params;

    const engineer = await Engineer.findByIdAndDelete(engineerId);
    if (!engineer) {
      return res.status(404).json({ message: "Engineer not found" });
    }

    res.status(200).json({ message: "Engineer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {createEngineer, updateEngineer,getEngineersByGarage,deleteEngineer}