const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String },
  body: { type: String },
  recipientId: { type: String },
  type: { type: String },
  relatedObjectId: { type: String },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
