const express = require("express");
const { verifyToken } = require("../common");
const router = express.Router();

//--------------------Admin------------------------------
//create Project
router.post("/create", verifyToken, async (req, res) => {
  try {
    console.log(req.user, "req.user");
    const { userId, email, name, role } = req.user;
    const {
      projectName,
      description,
      startDate,
      endDate,
      attachment,
      assignTo,
    } = req.body;

    const Data = {
      userId,
      companyName: name,
      projectName,
      description,
      startDate,
      endDate,
      attachment,
      assignTo,
    };

    res.json(Data);
  } catch (error) {
    console.error(error, "Error in creating project");
    res.status(500).json({ error: "Error in creating project" });
  }
});

// router.post("/projects", verifyToken, async (req, res) => {
//     try {
//       const { title, description } = req.body;
//       const { userId } = req.user;

//       // Check if required fields are provided
//       if (!title || !description) {
//         return res.status(422).json({ error: "Please fill all required fields" });
//       }

//       // Create the project
//       const project = new Project({
//         title,
//         description,
//         createdBy: userId
//       });

//       await project.save();

//       res.status(201).json({ message: "Project created successfully", project });
//     } catch (error) {
//       console.error(error, "Error in creating project");
//       res.status(500).json({ error: "Error in creating project" });
//     }
//   });

//   // Create a task within a project
//   router.post("/projects/:projectId/tasks", verifyAdminToken, async (req, res) => {
//     try {
//       const { title, date, description, assignedTo, hours } = req.body;
//       const { projectId } = req.params;

//       // Check if required fields are provided
//       if (!title || !date || !description || !assignedTo || !hours) {
//         return res.status(422).json({ error: "Please fill all required fields" });
//       }

//       // Check if the project ID is valid
//       if (!mongoose.Types.ObjectId.isValid(projectId)) {
//         return res.status(400).json({ error: "Invalid project ID" });
//       }

//       // Check if the project exists
//       const project = await Project.findById(projectId);
//       if (!project) {
//         return res.status(404).json({ error: "Project not found" });
//       }

//       // Create the task within the project
//       const task = new Task({
//         title,
//         date,
//         description,
//         assignedTo,
//         hours,
//         projectId
//       });

//       await task.save();

//       res.status(201).json({ message: "Task created successfully", task });
//     } catch (error) {
//       console.error(error, "Error in creating task");
//       res.status(500).json({ error: "Error in creating task" });
//     }
//   });

module.exports = router;
