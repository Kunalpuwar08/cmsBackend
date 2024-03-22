const express = require("express");
const { verifyToken } = require("../common");
const Leave = require("../models/leaveSchema");
const router = express.Router();
const { messaging } = require("firebase-admin");
const Notification = require("../models/notificationSchema");

//----------------------------emp----------------------------
router.post("/applyleave", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, reason, type, companyFcm } = req.body;
    const { companyName, companyId, userId, name, fcmToken } = req.user;

    const leaveApplicationData = {
      companyName: companyName,
      companyId: companyId,
      employeeId: userId,
      employeeName: name,
      startDate: startDate,
      endDate: endDate,
      reason: reason,
      type: type,
      status: "pending",
      employeeFcm: fcmToken,
    };

    const leave = new Leave(leaveApplicationData);
    leave
      .save()
      .then(async () => {
        res.status(201).json({ message: "Leave created successfully" });

        const notificationData = {
          title: "New Leave Application",
          body: "You have a new leave application to review",
          recipientId: companyId,
          type: "leave_application",
          relatedObjectId: leave._id,
        };

        const notification = new Notification(notificationData);
        await notification.save();

        const message = {
          notification: {
            title: "New Leave Application",
            body: "You have a new leave application to review",
          },
          token: companyFcm,
        };
        await messaging().send(message);
      })
      .catch(() => {
        res.status(500).json({ error: "Leave not created" });
      });
  } catch (error) {
    console.error("Error submitting leave application:", error);
    res.status(500).json({
      error: "Error submitting leave application",
      message: error.message,
    });
  }
});

router.get("/emplistleave", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const leaves = await Leave.find({ employeeId: userId });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves by company ID:", error);
    res.status(500).json({
      error: "Error fetching leaves by company ID",
      message: error.message,
    });
  }
});

//admin
router.get("/listleaves", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const leaves = await Leave.find({ companyId: userId });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves by company ID:", error);
    res.status(500).json({
      error: "Error fetching leaves by company ID",
      message: error.message,
    });
  }
});

router.post("/updateleave/:leaveId", verifyToken, async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, fcmToken } = req.body;

    await Leave.findByIdAndUpdate(leaveId, { status: status });

    res.status(200).json({ message: "Leave status updated successfully" });
    const message = {
      notification: {
        title: "Leave Application",
        body: `Your leave application is ${status}ed`,
      },
      token: fcmToken,
    };

    await messaging().send(message);
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({
      error: "Error updating leave status",
      message: error.message,
    });
  }
});

module.exports = router;
