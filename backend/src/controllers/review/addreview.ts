import { Request, Response } from "express";
import { Review } from "../../models/Review";


interface CustomRequest extends Request {
  user?: {
    _id: string;
  }
}

export const addReview = async (req: CustomRequest, res: Response) => {
  const { movieId, review, rating } = req.body;
  
  const userId = req.user?._id;
  
  if (!movieId) {
    console.log("No movie ID provided");
    res.status(500).send({ message: "No movie ID provided" });
  }

  if (!review && !rating) {
    console.log("Neither review nor rating provided");
    return res.status(400).send({ message: "At least one of review or rating must be provided" });
  }

  try {
    const newReview = new Review({
      userId : userId,
      movieId, review, rating
    });
    await newReview.save();
    console.log("Review saved successfully");
    res.status(201).send({ message: 'Review saved successfully' });
  } catch (error: any) {
    console.log("Error saving review:", error);
    res.status(500).send({ message: 'Error saving review' });
  }
};

