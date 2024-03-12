const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  // id,name,password,phone,plan,role,requiresPasswordChange,fcmToken,address,email
  // companyId,companyName,email,fcmToken,id,name,password,requiresPasswordChange,role
  //   id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  address: { type: String },
  phone: { type: String },
  role: { type: String },
  plan: { type: String },
  isPasswordChanged: { type: Boolean },
  fcmToken: { type: String },
});

const Admin = mongoose.model("ADMIN", adminSchema);

module.exports = Admin;
