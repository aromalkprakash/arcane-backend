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
exports.getFollowingUsersReview = void 0;
const Review_1 = require("../../../models/Review");
const userModel_1 = require("../../../models/userModel");
const Movie_1 = require("../../../models/Movie");
const getFollowingUsersReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(400).json({ error: "User ID not found" });
        }
        const userData = yield userModel_1.User.findById(userId).select('following').exec();
        if (!userData || !userData.following) {
            return res.status(400).json({ error: "User data or following list not found" });
        }
        // Extract the IDs of users that the authenticated user follows
        const followingUserIds = userData.following.map((id) => id.toString());
        // console.log('Following User IDs:', followingUserIds); // Debugging
        if (followingUserIds.length === 0) {
            return res.status(404).json({ error: "No following users found" });
        }
        // Fetch reviews written by the followed users
        const reviews = yield Review_1.Review.find({ userId: { $in: followingUserIds } }).sort({ createdAt: -1 }).exec();
        // console.log('Reviews:', reviews); // Debugging
        if (reviews.length === 0) {
            return res.status(404).json({ error: "No reviews found for following users" });
        }
        // Fetch details for each review
        const reviewsWithDetails = yield Promise.all(reviews.map((review) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const [movieDetails, userDetails] = yield Promise.all([
                    Movie_1.Movie.findById(review.movieId.toString()), // Ensure movieId is a string
                    userModel_1.User.findById(review.userId.toString()) // Ensure userId is a string
                ]);
                return {
                    review: review.toObject(),
                    movie: movieDetails,
                    user: userDetails,
                };
            }
            catch (detailError) {
                console.error(`Error fetching details for reviewId ${review._id}: ${detailError.message}`);
                return {
                    review: review.toObject(),
                    movie: null,
                    user: null,
                };
            }
        })));
        // Return the combined data
        res.status(200).json(reviewsWithDetails);
    }
    catch (error) {
        console.error(`Error in getFollowingUsersReview: ${error.message}`);
        res.status(500).json({ error: `Error in getFollowingUsersReview: ${error.message}` });
    }
});
exports.getFollowingUsersReview = getFollowingUsersReview;
