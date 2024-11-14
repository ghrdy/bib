import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import childProfileRoutes from "./routes/childProfiles.js";
import bookLoanRoutes from "./routes/bookLoans.js";
import uploadRoutes from "./routes/upload.js";
import authToken from "./middleware/authToken.js";

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/ULPT");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api", userRoutes);
app.use("/api/upload", uploadRoutes); // Route pour les uploads d'images

app.use("/api/projects", projectRoutes);
app.use("/api/childProfiles", childProfileRoutes);
app.use("/api/bookLoans", bookLoanRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
