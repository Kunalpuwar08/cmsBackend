const express = require("express");
const { verifyToken } = require("../common");
const Employee = require("../models/employeeSchema");
const Message = require("../models/messageSchema");
const { messaging } = require("firebase-admin");
const router = express.Router();

router.get("/chatList", verifyToken, async (req, res) => {
  try {
    const { companyId, userId } = req.user;

    let employees = await Employee.find(
      { companyId: companyId },
      "name email fcmToken profileimageUrl"
    );

    employees = employees.filter(
      (employee) => employee._id.toString() !== userId
    );

    res.status(200).json({ list: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send", verifyToken, async (req, res) => {
  try {
    const { userId, companyId } = req.user;
    const { receiverId, message } = req.body;

    const receiver = await Employee.findOne({
      _id: receiverId,
      companyId: companyId,
    });
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const newMessage = new Message({
      sender: userId,
      receiver: receiverId,
      message: message,
    });
    await newMessage.save();

    // You can also send push notifications to the receiver if needed
    const notiMessage = {
      notification: {
        title: receiverId,
        body: `You have a new message from ${userId}`,
      },
      token: receiver.fcmToken,
    };

    await messaging().send(notiMessage);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages/:senderId/:receiverId", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    await Message.updateMany(
      { sender: receiverId, receiver: senderId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
