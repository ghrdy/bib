import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import authToken from "../middleware/authToken.js";
import isAdmin from "../middleware/isAdmin.js";
import nodemailer from "nodemailer"; // Ajouter cette ligne pour utiliser nodemailer

const router = express.Router();
const secretKey = "your_secret_key"; // Replace with your actual secret key
const refreshTokenSecret = "your_refresh_secret_key";

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        nom: user.nom, // Ajout du nom
        prenom: user.prenom, // Ajout du prénom
      },
      secretKey,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        nom: user.nom, // Ajout du nom
        prenom: user.prenom, // Ajout du prénom
      },
      refreshTokenSecret,
      {
        expiresIn: "6h",
      }
    );

    // Save refresh token in the database
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      userId: user._id,
    });
    await newRefreshToken.save();

    // Set cookies
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });

    res.json({ reftoken: refreshToken, token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/status", async (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.json({ message: "User is not logged in", loggedIn: false });
  }
  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.user = decoded;
    res.json({
      message: "User is logged in",
      loggedIn: true,
      role: decoded.role,
    });
  } catch (err) {
    return res.json({ message: "Invalid token", loggedIn: false });
  }
});

// Route pour définir le mot de passe
router.post("/set-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, secretKey);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: "Password set successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Protected routes (authentication required)
router.use(authToken);

// Create a new user (Admin only)
router.post("/add", isAdmin, async (req, res) => {
  const { nom, prenom, email, role } = req.body;
  try {
    const newUser = new User({
      nom,
      prenom,
      email,
      role,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

    // Générer un token de création de compte et envoyer un email
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email },
      secretKey,
      { expiresIn: "1h" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tim.hrdy.1@gmail.com",
        pass: "cwsc oywb robk hpsj",
      },
    });

    const mailOptions = {
      from: "tim.hrdy.1@gmail.com",
      to: savedUser.email,
      subject: "Création de compte : Un Livre Pour Tous",
      html: `<p>Cliquez sur le lien pour définir votre mot de passe. : </p>
             <a href="http://localhost:5173/create-account?token=${token}">Créer Votre Compte</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      } else {
        res.json({ message: "Email sent: " + info.response });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users (Admin only)
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user (Admin only)
router.put("/:id", isAdmin, async (req, res) => {
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
router.delete("/:id", isAdmin, async (req, res) => {
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

// Logout a user
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).json({ message: "Token is required" });

    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "User logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Refresh token route
router.post("/token", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Access denied" });

  try {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const newToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          nom: user.nom,
          prenom: user.prenom,
        },
        secretKey,
        {
          expiresIn: "15m",
        }
      );

      res.cookie("accessToken", newToken, {
        httpOnly: false,
        secure: true,
        sameSite: "Strict",
      });
      res.json({ message: "Token refreshed" });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
