import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  image: String,
  nom: String,
  annee: Number,
});

export default mongoose.model("Project", projectSchema);
