import { Request, Response } from "express";
import { Review } from "../../models/Review";

export const likeReview = async (req: Request, res: Response) => {
  const { reviewId, userId, action } = req.body;

  try {
    if (action === 'like') {
      // Add userId to the review's likes array
      await Review.findByIdAndUpdate(reviewId, { $addToSet: { likes: userId } });
    } else if (action === 'unlike') {
      // Remove userId from the review's likes array
      await Review.findByIdAndUpdate(reviewId, { $pull: { likes: userId } });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error in likeReview:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

