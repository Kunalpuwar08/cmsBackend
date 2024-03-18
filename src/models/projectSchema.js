const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdDate: { type: Date, required: true },
  deadlineDate: { type: Date, required: true },
  companyId: { type: String},
  status: { type: String, required: true },
  priority: { type: String, required: true },
  // task: [String],
  // files: [{ link: String, type: String }],
  type: { type: String, required: true },
  assignTo: { type: String, required: true },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
