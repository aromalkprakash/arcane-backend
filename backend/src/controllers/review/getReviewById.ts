import { Review } from "../../models/Review";

export const getReviewById = async (reviewId: any) => {
    try {
        const review = await Review.findById(reviewId).exec();
        
        if (!review) {
            throw new Error("Review not found");
        }
      
        return review;
    } catch (error: any) {
        console.log("Error in getReviewById: ", error.message);
        throw new Error(error.message);
    }
};
