const express = require("express");
const { verifyToken } = require("../common");
const Asset = require("../models/assetSchema");

const router = express.Router();
const multer = require("multer");
const { firestore, storage } = require("firebase-admin");

const db = firestore();
const bucket = storage().bucket();

const multerstorage = multer.memoryStorage();
const assetUpload = multer({ storage: multerstorage });

//------------------------ ADMIN ---------------------------
router.post(
  "/create",
  assetUpload.single("image"),
  verifyToken,
  async (req, res) => {
    try {
      const { name, type, brand, description } = req.body;
      const { userId } = req.user;

      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        throw new Error("Invalid user ID");
      }

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
      const randomNumber = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      const serialNumber = `${formattedDate}-${randomNumber}`;

      let imageUrl = null;
      if (req.file) {
        const imageFileName = `${userId}_${Date.now()}_${
          req.file.originalname
        }`;

        const file = bucket.file(imageFileName);
        await file.save(req.file.buffer, {
          contentType: req.file.mimetype,
          resumable: false,
        });
        imageUrl = `https://storage.googleapis.com/${bucket.name}/${imageFileName}`;
      }

      const data = {
        name,
        type,
        brand,
        description,
        serialNumber,
        companyId: userId,
        imageUrl,
        assignTo:{},
        status:'available'
      };

      const asset = new Asset(data);
      asset
        .save()
        .then(() => {
          res.status(201).json({ message: "asset created successfully" });
        })
        .catch(() => {
          res.status(500).json({ error: "asset not created" });
        });
    } catch (error) {
      console.error("Error adding office asset:", error);
      res
        .status(500)
        .json({ error: "Error adding office asset", message: error.message });
    }
  }
);

router.post("/assign", verifyToken, async (req, res) => {
  try {
    const { assetId, userId, userName } = req.body;

    await Asset.findByIdAndUpdate(assetId, {
      assignTo: { id: userId, name: userName },
      status: 'in use'
    });

    res.status(200).json({ message: "Asset assigned successfully" });
  } catch (error) {
    console.error("Error assigning asset:", error);
    res
      .status(500)
      .json({ error: "Error assigning asset", message: error.message });
  }
});

router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const assetId = req.params.id;

    await Asset.findByIdAndRemove(assetId);

    res.status(200).json({ message: "Asset removed successfully" });
  } catch (error) {
    console.error("Error removing asset:", error);
    res
      .status(500)
      .json({ error: "Error removing asset", message: error.message });
  }
});

router.get("/listAsset", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const assignedAssets = await Asset.find({ companyId: userId });

    res.status(200).json({ assignedAssets });
  } catch (error) {
    console.error("Error getting assets:", error);
    res.status(500).json({
      error: "Error getting assets",
      message: error.message,
    });
  }
});

//----------------------- EMP --------------------------------
router.get("/get-asset", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const assignedAssets = await Asset.find({ "assignTo.id": userId });

    res.status(200).json({ assets: assignedAssets });
  } catch (error) {
    console.error("Error fetching assigned assets:", error);
    res.status(500).json({
      error: "Error fetching assigned assets",
      message: error.message,
    });
  }
});

module.exports = router;
