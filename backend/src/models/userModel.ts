import mongoose, { Connection, Model } from "mongoose";
import { UserInterface } from "../types/Usertypes";

const UserSchema = new mongoose.Schema<UserInterface>({
    fullName: {type: "string"},
    email: { type: "string", required: true, unique: true },
    username: { type: "string", unique: true },
    role: { type: "string", default: "USER" },
    image: { type: "string", default: "" },
    coverImage: { type: "string", default: "" },
    googleId: {type: "string",},
    password: { type: "string", select: false },
    bio: { type: "string", default: "" },
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie", default: [] }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie", default: []  }],
    likedReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review", default: []  }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    verified: {type: Boolean}
    
},
    { timestamps: true });
  
export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
