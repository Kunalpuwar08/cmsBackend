const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
  description: { type: String, required: true },
});

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports = Timesheet;
