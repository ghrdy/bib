import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import childProfileRoutes from "./routes/childProfiles.js";
import bookLoanRoutes from "./routes/bookLoans.js";
import uploadRoutes from "./routes/upload.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 5001;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/dev");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); // Route pour les uploads d'images
app.use("/api/projects", projectRoutes);
app.use("/api/childProfiles", childProfileRoutes);
app.use("/api/bookLoans", bookLoanRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
