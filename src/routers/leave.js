const express = require("express");
const { verifyToken } = require("../common");
const Leave = require("../models/leaveSchema");
const router = express.Router();

router.post("/applyleave", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, reason, type } = req.body;
    const {companyName,companyId,userId,name} = req.user;

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
    };
    
    const leave = new Leave(leaveApplicationData);
    leave
      .save()
      .then(() => {
        res.status(201).json({ message: "Leave created successfully" });
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
    const { status } = req.body;

    await Leave.findByIdAndUpdate(leaveId, { status: status });

    res.status(200).json({ message: "Leave status updated successfully" });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({
      error: "Error updating leave status",
      message: error.message,
    });
  }
});

module.exports = router;
