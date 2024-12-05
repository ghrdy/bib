import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  image: String,
  nom: String,
  annee: Number,
  animateurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Project", projectSchema);
