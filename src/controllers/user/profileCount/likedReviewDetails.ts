import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
import { getMovieDetails } from "../../movie/getmovieDetails";
import { getUserDetails } from "./getCountDetails";
import { getReviewById } from "../../review/getReviewById";
import { Movie } from "../../../models/Movie";

export const getLikedReviewDetails = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('likedReviews')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure likedReviews is an array
        const likedReviews = user.likedReviews || [];

        // Fetch detailed data from other services
        const likedReviewPromises = likedReviews.map(async (reviewId: any) => {
            try {
                const review = await getReviewById(reviewId.toString());

                const [movieResponse, userDetails] = await Promise.all([
                    await Movie.findById(review.movieId.toString()),
                    getUserDetails(review.userId.toString())
                ]);

                if (!movieResponse || !userDetails) {
                    throw new Error("Failed to fetch movie or user details");
                }

                return {
                    review,
                    movie: movieResponse,
                    user: userDetails,
                };
            } catch (err) {
                console.error(`Error fetching details for review ID ${reviewId}:`, err);
                return null;
            }
        });

        // Await all promises
        const likedReviewDetails = await Promise.all(likedReviewPromises);

        // Filter out null responses
        const validLikedReviewDetails = likedReviewDetails.filter(detail => detail !== null);

        return res.json({
            likedReviews: validLikedReviewDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user liked review data:', err);
        return res.status(500).json({ message: 'Error fetching liked review details' });
    }
};
