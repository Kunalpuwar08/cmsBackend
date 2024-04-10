const express = require("express");
const { verifyToken } = require("../common");
const Timesheet = require("../models/timesheetSchema");
const Employee = require("../models/employeeSchema");
const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { projectId, date, hours, description } = req.body;
    const { userId, companyId, name } = req.user;

    const existingTimesheet = await Timesheet.findOne({ userId, date });

    if (existingTimesheet) {
      return res
        .status(400)
        .json({ error: "Timesheet already exists for this user and date" });
    }

    const timesheet = new Timesheet({
      projectId,
      userId,
      date,
      hours,
      description,
      companyId,
      name,
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

router.get("/list", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const timesheets = await Timesheet.find({ userId });

    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Error retrieving Timesheets:", error);
    res
      .status(500)
      .json({ error: "Error retrieving Timesheets", message: error.message });
  }
});

//admin list api
router.get("/admin/list", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const timesheets = await Timesheet.find({ companyId: userId });

    const timesheetsByEmployee = {};

    const employees = await Employee.find({ companyId: userId }, "name");

    employees.forEach((employee) => {
      timesheetsByEmployee[employee.name] = [];
    });

    timesheets.forEach((timesheet) => {
      timesheetsByEmployee[timesheet.name].push(timesheet);
    });

    res.status(200).json(timesheetsByEmployee);
  } catch (error) {
    console.error("Error retrieving Timesheets:", error);
    res
      .status(500)
      .json({ error: "Error retrieving Timesheets", message: error.message });
  }
});

module.exports = router;
