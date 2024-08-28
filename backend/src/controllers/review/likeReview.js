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
exports.likeReview = void 0;
const Review_1 = require("../../models/Review");
const likeReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId, userId, action } = req.body;
    try {
        if (action === 'like') {
            // Add userId to the review's likes array
            yield Review_1.Review.findByIdAndUpdate(reviewId, { $addToSet: { likes: userId } });
        }
        else if (action === 'unlike') {
            // Remove userId from the review's likes array
            yield Review_1.Review.findByIdAndUpdate(reviewId, { $pull: { likes: userId } });
        }
        else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        res.status(200).json({ message: 'Success' });
    }
    catch (error) {
        console.error('Error in likeReview:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.likeReview = likeReview;
