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
exports.getReviewByMovie = void 0;
const Review_1 = require("../../models/Review");
const userModel_1 = require("../../models/userModel");
const getReviewByMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        // Fetch reviews from the Review database
        const reviews = yield Review_1.Review.find({ movieId }).sort({ createdAt: -1 });
        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No reviews found for this movie' });
        }
        // Fetch user data from the User database
        const userIds = reviews.map((review) => review.userId.toString()); // Ensure userId is a string
        // Fetch user details if there are user IDs
        let users = {};
        if (userIds.length > 0) {
            const userResponses = yield userModel_1.User.find({ _id: { $in: userIds } });
            users = userResponses.reduce((acc, user) => {
                acc[user._id.toString()] = user;
                return acc;
            }, {});
        }
        // Attach user data to each review
        const reviewsWithUsers = reviews.map((review) => {
            var _a;
            return (Object.assign(Object.assign({}, review.toObject()), { user: users[review.userId.toString()] || {}, rating: (_a = review.rating) !== null && _a !== void 0 ? _a : 0 }));
        });
        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => { var _a; return sum + ((_a = review.rating) !== null && _a !== void 0 ? _a : 0); }, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        res.status(200).json({ reviews: reviewsWithUsers, averageRating });
    }
    catch (err) {
        console.error('Error retrieving reviews:', err.message);
        res.status(500).json({ message: 'Error retrieving reviews' });
    }
});
exports.getReviewByMovie = getReviewByMovie;
