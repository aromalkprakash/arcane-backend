import { Request, Response } from 'express';
import { Review } from "../../models/Review";
import { User } from "../../models/userModel";

export const getReviewByMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;

    // Fetch reviews from the Review database
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.status(200).json({ message: 'No reviews found for this movie' });
    }

    // Fetch user data from the User database
    const userIds = reviews.map((review: any )=> review.userId.toString()); // Ensure userId is a string

    // Fetch user details if there are user IDs
    let users: any = {};
    if (userIds.length > 0) {
      const userResponses = await User.find({ _id: { $in: userIds } });
      users = userResponses.reduce((acc: any, user: any) => {
        acc[user._id.toString()] = user;
        return acc;
      }, {});
    }

    // Attach user data to each review
    const reviewsWithUsers = reviews.map((review: any) => ({
      ...review.toObject(),
      user: users[review.userId.toString()] || {},
      rating: review.rating ?? 0, // Default rating to 0 if null or undefined
    }));

    // Calculate average rating
    const totalRating = reviews.reduce((sum: any, review: any) => sum + (review.rating ?? 0), 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({ reviews: reviewsWithUsers, averageRating });
  } catch (err: any) {
    console.error('Error retrieving reviews:', err.message);
    res.status(500).json({ message: 'Error retrieving reviews' });
  }
};
