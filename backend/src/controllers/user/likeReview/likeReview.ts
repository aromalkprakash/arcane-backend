import {Request, Response} from "express"
import { User } from "../../../models/userModel";

export const updateLikedReview = async (req: Request, res: Response) => {
  const { reviewId, userId, action } = req.body;

  try {
    if (action === 'like') {
      // Add reviewId to the user's likedReviews array
      await User.findByIdAndUpdate(userId, { $addToSet: { likedReviews: reviewId } });
    } else if (action === 'unlike') {
      // Remove reviewId from the user's likedReviews array
      await User.findByIdAndUpdate(userId, { $pull: { likedReviews: reviewId } });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error in updateLikedReviews:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

