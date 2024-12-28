import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/User.js";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://mongo:27017/dev";

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  const adminEmail = "tim.hrdy.1@gmail.com";
  const adminPassword = "password";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      nom: "Admin",
      prenom: "User",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  mongoose.connection.close();
});
