import { Request, Response } from "express";
import { Review } from "../../models/Review";
import { removeLikedReview } from "../user/likeReview/removeLikeReview";

interface CustomRequest extends Request {
    user?: any;
}

export const deleteReview = async (req: CustomRequest, res: Response) => {
    const { reviewId } = req.params; // Access the reviewId property

    try {
        // Check if review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Delete the review
        await Review.findByIdAndDelete(reviewId);

        // Notify User Service to remove review ID from likedReviews
        await removeLikedReview(reviewId);

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        console.error('Error in deleteReview controller:', error.message);
        res.status(500).json({ error: error.message || 'Internal server issue' });
    }
};
