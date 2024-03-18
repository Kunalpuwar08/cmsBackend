const express = require("express");
const { verifyToken } = require("../common");
const Project = require("../models/projectSchema");
const router = express.Router();

// let gfs;
// connection.once("open", () => {
//   gfs = Grid(connection.db, mongoose.mongo);
//   gfs.collection("uploads");
// });

// const storage = multer.memoryStorage();
// const projectMedia = multer({ storage: storage });

router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      name,
      description,
      createdDate,
      deadlineDate,
      status,
      priority,
      type,
      assignTo,
    } = req.body;
    const { userId } = req.user;

    const fileUrls = [];
    // if (req.files && req.files.length > 0) {
    //   for (const file of req.files) {
    //     const imageFileName = `${userId}_${Date.now()}_${file.originalname}`;
    //     const writeStream = gfs.createWriteStream({
    //       filename: imageFileName,
    //     });
    //     writeStream.write(file.buffer);
    //     writeStream.end();

    //     const fileUrl = `/file/${imageFileName}`;
    //     fileUrls.push({ link: fileUrl, type: file.mimetype });
    //   }
    // }

    const projectData = new Project({
      name: name,
      description: description,
      createdDate: createdDate,
      deadlineDate: deadlineDate,
      companyId: userId,
      status: status,
      priority: priority,
      task: [],
      files: fileUrls,
      type: type,
      assignTo: assignTo,
    });

    await projectData
      .save()
      .then(() => {
        res.status(201).json({ message: "Project created successfully" });
      })
      .catch(() => {
        res.status(500).json({ error: "Project not created" });
      });

    res.status(201).json({
      message: "Project added successfully",
    });
  } catch (error) {
    console.error("Error adding Project:", error);
    res
      .status(500)
      .json({ error: "Error adding Project", message: error.message });
  }
});

router.delete("/delete/:projectId", verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting Project:", error);
    res
      .status(500)
      .json({ error: "Error deleting Project", message: error.message });
  }
});

router.patch("/update/:projectId", verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;

    await Project.findByIdAndUpdate(projectId, updateData);

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating Project:", error);
    res
      .status(500)
      .json({ error: "Error updating Project", message: error.message });
  }
});

module.exports = router;
