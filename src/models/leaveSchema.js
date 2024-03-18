const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String },
  companyName: { type: String },
  companyId: { type: String },
});

const Leave = mongoose.model("LEAVE", leaveSchema);

module.exports = Leave;
