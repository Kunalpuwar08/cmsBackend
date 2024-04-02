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
});

const Todo = mongoose.model("TODO", todosSchema);

module.exports = Todo;
