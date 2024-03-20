const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  companyFcm: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  address: { type: String },
  phone: { type: String },
  role: { type: String },
  isPasswordChanged: { type: Boolean },
  fcmToken: { type: String },
});

const Employee = mongoose.model("EMPLOYEE", employeeSchema);

module.exports = Employee;
