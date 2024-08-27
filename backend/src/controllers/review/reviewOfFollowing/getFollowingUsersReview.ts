import { Request, Response } from 'express';
import { Review } from "../../../models/Review";
import { getMovieDetails } from "../../movie/getmovieDetails";
import { User } from "../../../models/userModel";
import { Movie } from "../../../models/Movie";

interface CustomRequest extends Request {
    user?: {
        _id: string;
    }
}

export const getFollowingUsersReview = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found" });
        }

        const userData = await User.findById(userId).select('following').exec();

        if (!userData || !userData.following) {
            return res.status(400).json({ error: "User data or following list not found" });
        }

        // Extract the IDs of users that the authenticated user follows
        const followingUserIds = userData.following.map((id: any) => id.toString());

        // console.log('Following User IDs:', followingUserIds); // Debugging

        if (followingUserIds.length === 0) {
            return res.status(404).json({ error: "No following users found" });
        }

        // Fetch reviews written by the followed users
        const reviews = await Review.find({ userId: { $in: followingUserIds } }).sort({ createdAt: -1 }).exec();

        // console.log('Reviews:', reviews); // Debugging

        if (reviews.length === 0) {
            return res.status(404).json({ error: "No reviews found for following users" });
        }

        // Fetch details for each review
        const reviewsWithDetails = await Promise.all(
            reviews.map(async (review: any) => {
                try {
                    const [movieDetails, userDetails] = await Promise.all([
                        Movie.findById(review.movieId.toString()), // Ensure movieId is a string
                        User.findById(review.userId.toString()) // Ensure userId is a string
                    ]);

                    return {
                        review: review.toObject(),
                        movie: movieDetails,
                        user: userDetails,
                    };
                } catch (detailError: any) {
                    console.error(`Error fetching details for reviewId ${review._id}: ${detailError.message}`);
                    return {
                        review: review.toObject(),
                        movie: null,
                        user: null,
                    };
                }
            })
        );

        // Return the combined data
        res.status(200).json(reviewsWithDetails);
    } catch (error: any) {
        console.error(`Error in getFollowingUsersReview: ${error.message}`);
        res.status(500).json({ error: `Error in getFollowingUsersReview: ${error.message}` });
    }
};
