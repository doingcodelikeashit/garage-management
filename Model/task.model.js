const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    garageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    taskDuration: {
      type: Number, // Duration in minutes (or hours if needed)
      //   required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
