const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    _id: {
      ref: "Employee",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  receiver: {
    _id: {
      ref: "Employee",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
