const express = require("express");
const { verifyToken } = require("../common");
const Project = require("../models/projectSchema");
const router = express.Router();

const multer = require("multer");
const { getStorage, ref, uploadBytes } = require("firebase-admin/storage");

const multerstorage = multer.memoryStorage();
const attachments = multer({ storage: multerstorage });

router.post(
  "/create",
  attachments.array("files", 10),
  verifyToken,
  async (req, res) => {
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

      const files = req.files;
      const fileUrls = [];

      for (const file of files) {
        const imageFileName = `${userId}_${Date.now()}_${file.originalname}`;
        const storage = getStorage();
        const bucket = storage.bucket();

        await bucket.file(imageFileName).save(file.buffer, {
          contentType: file.mimetype,
        });

        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;
        fileUrls.push(downloadURL);
      }

      console.log(fileUrls,"fileUrls");

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


      projectData
        .save()
        .then(() => {
          res.status(201).json({ message: "Project created successfully" });
        })
        .catch(() => {
          res.status(500).json({ error: "Project not created" });
        });
    } catch (error) {
      console.error("Error adding Project:", error);
      res
        .status(500)
        .json({ error: "Error adding Project", message: error.message });
    }
  }
);

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
