import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  bannerImg: { type: String },
  description: { type: String },
  releaseYear: { type: String },
  genre: [{ type: String }],
  duration: { type: String },
  director: [{ type: String }],
  actors: [{ type: String }],
  trailer: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

export const Movie = mongoose.models?.Movie || mongoose.model("Movie", movieSchema);
