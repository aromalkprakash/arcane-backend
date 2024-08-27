import mongoose, { Connection, Model } from "mongoose";
import { IReview } from "../types/Usertypes";

const reviewSchema = new mongoose.Schema<IReview>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true,},
  rating: { type: Number, min: 0, max: 10,},
  review: { type: String, },
  likes:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {timestamps: true});


export const Review = mongoose.models?.Review || mongoose.model("Review", reviewSchema);

