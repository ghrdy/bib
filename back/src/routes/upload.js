// routes/uploadRoutes.js
import express from "express";
import upload from "../middleware/imageUpload.js";
import Image from "../models/Image.js";

const router = express.Router();

// Route pour l'upload d'images
router.post("/", (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    try {
      const filePath = `/uploads/${req.file.filename}`;
      const newImage = new Image({ url: filePath });
      await newImage.save();

      res
        .status(200)
        .json({ message: "Image uploadée avec succès!", url: filePath });
    } catch (dbError) {
      res.status(500).json({
        error: "Erreur lors de la sauvegarde dans la base de données",
      });
    }
  });
});

export default router;
