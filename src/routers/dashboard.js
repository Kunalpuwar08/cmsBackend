const express = require("express");
const router = express.Router();
const Leave = require("../models/leaveSchema");
const Asset = require("../models/assetSchema");
const Project = require("../models/projectSchema");
const Employee = require("../models/employeeSchema");
const { verifyToken } = require("../common");

router.get("/dashboard", verifyToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const projectCount = await Project.countDocuments({ companyId: userId });

    const leaveCount = await Leave.countDocuments({ companyId: userId });

    const assetCount = await Asset.countDocuments({ companyId: userId });
    const employeeCount = await Employee.countDocuments({ companyId: userId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeLeaveCount = await Leave.countDocuments({
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: "approve",
    });

    res.status(200).json({
      projectCount,
      leaveCount,
      assetCount,
      employeeCount,
      activeLeaveCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res
      .status(500)
      .json({ error: "Error fetching dashboard data", message: error.message });
  }
});

module.exports = router;
