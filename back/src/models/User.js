import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  password: String,
  projet: String,
  role: {
    type: String,
    enum: ["admin", "referent", "simple"],
    default: "simple",
  },
});

export default mongoose.model("User", userSchema);
