import mongoose from "mongoose";

export interface UserInterface {
    _id: mongoose.Schema.Types.ObjectId;
    fullName: string;
    email: string;
    username: string;
    role: string;
    image?: string;
    coverImage?: string;
    googleId?: string | null;
    password: string;
    bio: string;
    link?: string; 
    watchList: mongoose.Schema.Types.ObjectId[];
    favorites: mongoose.Schema.Types.ObjectId[];
    likedReviews: mongoose.Schema.Types.ObjectId[];
    followers: mongoose.Schema.Types.ObjectId[];
    following: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    verified: Boolean;
}

export interface IMovie extends Document {
    title: string;
    poster?: string;
    bannerImg?: string;
    description?: string;
    releaseYear?: string;
    genre?: string[];
    duration?: string;
    director?: string[];
    actors?: string[];
    trailer?: string;
    likes?: mongoose.Types.ObjectId[];
}
  
export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    movieId: mongoose.Types.ObjectId;
    rating?: number;
    review?: string;
    likes?: mongoose.Types.ObjectId[];
}
  
export interface IUserOtpVerification extends Document {
        userId: string;
        otp: string;
        createdAt: Date;
        expiresAt: Date;
    }
  