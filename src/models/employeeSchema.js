const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyFcm: { type: String, default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: null },
  address: { type: String, default: null },
  phone: { type: String, default: null },
  role: { type: String, default: null },
  isPasswordChanged: { type: Boolean },
  fcmToken: { type: String, default: null },
  profileimageUrl: { type: String },
  salary: { type: Number },
  designation: { type: String },
});

const Employee = mongoose.model("EMPLOYEE", employeeSchema);

module.exports = Employee;
