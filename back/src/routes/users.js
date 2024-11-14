import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();
const secretKey = "your_secret_key"; // Replace with your actual secret key

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin") {
    console.log("isAdmin");
    next();
  } else {
    res.status(403).json({ message: "Access denied (isAdmin)" });
  }
};

// Protected routes (authentication required)
router.use(authToken);

// Create a new user (Admin only)
router.post("/users", isAdmin, async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users (Admin only)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user (Admin only)
router.put("/users/:id", isAdmin, async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;
  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { nom, prenom, email, password: hashedPassword, role },
      { new: true }
    );
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user (Admin only)
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
