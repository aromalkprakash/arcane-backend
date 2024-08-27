import { Request, Response } from 'express';
import { User } from "../../../models/userModel";

export const removeLikedReview = async (reviewId: string) => {
    console.log('Removing review ID from likedReviews:', reviewId);
    
    try {
        const result = await User.updateMany(
            { likedReviews: reviewId },
            { $pull: { likedReviews: reviewId } }
        );
        
        console.log('Update result:', result);
        // Return a message or status if needed
    } catch (error: any) {
        console.error('Error removing liked review:', error.message);
        // Handle the error appropriately
    }
};
