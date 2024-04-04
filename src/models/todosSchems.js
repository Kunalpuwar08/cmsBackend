const mongoose = require("mongoose");

const todosSchema = new mongoose.Schema({
  userId: { type: String },
  email: { type: String },
  name: { type: String },
  title: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, require: true },
  description: { type: String, required: true },
  companyName: { type: String },
  companyId: { type: String },
  estimationHours: { type: Number, require: true },
  isStarted: { type: Boolean },
  startTime: { type: String },
  isPaused: { type: Boolean, default: false },
  remainingHours: { type: String },
  isCompleted: { type: Boolean },
  pauseTime: {type: Number}
});

const Todo = mongoose.model("TODO", todosSchema);

module.exports = Todo;
