import express from "express";
import Project from "../models/Project.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/isAdmin.js";
const router = express.Router();

// Protected routes (authentication required)
router.use(authToken);

// Create a new project
router.post("/", isAdmin, async (req, res) => {
  const { image, nom, annee, description, animateurs } = req.body;
  const newProject = new Project({
    image,
    nom,
    annee,
    description,
    animateurs,
  });
  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a project
router.put("/:id", isAdmin, async (req, res) => {
  const { image, nom, annee, description, animateurs } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { image, nom, annee, description, animateurs },
      { new: true }
    );
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a project
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) {
      res.json({ message: "Project deleted" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
