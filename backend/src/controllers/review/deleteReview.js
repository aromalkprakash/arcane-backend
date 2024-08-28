"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = void 0;
const Review_1 = require("../../models/Review");
const removeLikeReview_1 = require("../user/likeReview/removeLikeReview");
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params; // Access the reviewId property
    try {
        // Check if review exists
        const review = yield Review_1.Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        // Delete the review
        yield Review_1.Review.findByIdAndDelete(reviewId);
        // Notify User Service to remove review ID from likedReviews
        yield (0, removeLikeReview_1.removeLikedReview)(reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteReview controller:', error.message);
        res.status(500).json({ error: error.message || 'Internal server issue' });
    }
});
exports.deleteReview = deleteReview;
