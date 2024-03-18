const express = require("express");
const { verifyToken } = require("../common");
const Timesheet = require("../models/timesheetSchema");
const router = express.Router();

// Create timesheet
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { projectId, date, hours, description } = req.body;
    const { userId } = req.user;

    const timesheet = new Timesheet({
      projectId,
      userId,
      date,
      hours,
      description,
    });

    await timesheet.save();

    res.status(201).json({ message: "Timesheet created successfully" });
  } catch (error) {
    console.error("Error creating Timesheet:", error);
    res
      .status(500)
      .json({ error: "Error creating Timesheet", message: error.message });
  }
});

// Update timesheet
router.patch("/update/:timesheetId", verifyToken, async (req, res) => {
  try {
    const { timesheetId } = req.params;
    const { hours } = req.body;

    await Timesheet.findByIdAndUpdate(timesheetId, { hours: hours });

    res.status(200).json({ message: "Timesheet updated successfully" });
  } catch (error) {
    console.error("Error updating Timesheet:", error);
    res
      .status(500)
      .json({ error: "Error updating Timesheet", message: error.message });
  }
});

// Get timesheets by user ID
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const timesheets = await Timesheet.find({ userId: userId });

    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Error retrieving Timesheets:", error);
    res
      .status(500)
      .json({ error: "Error retrieving Timesheets", message: error.message });
  }
});

module.exports = router;
