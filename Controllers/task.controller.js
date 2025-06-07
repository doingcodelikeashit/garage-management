const Task = require("../Model/task.model");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const garageId = req.garage.id;
    const { taskName, taskDuration } = req.body;

    const task = new Task({ garageId, taskName, taskDuration });
    await task.save();

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName, taskDuration } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, taskDuration },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Tasks by Garage
exports.getTasksByGarage = async (req, res) => {
  try {
    const garageId = req.garage.id;
    // console.log(garageId);
    const tasks = await Task.find({ garageId });

    res.status(200).json({ message: "Tasks fetched", tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
