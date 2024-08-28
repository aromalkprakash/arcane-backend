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
exports.getLikedReviewDetails = void 0;
const userModel_1 = require("../../../models/userModel");
const getCountDetails_1 = require("./getCountDetails");
const getReviewById_1 = require("../../review/getReviewById");
const Movie_1 = require("../../../models/Movie");
const getLikedReviewDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('likedReviews')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Ensure likedReviews is an array
        const likedReviews = user.likedReviews || [];
        // Fetch detailed data from other services
        const likedReviewPromises = likedReviews.map((reviewId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const review = yield (0, getReviewById_1.getReviewById)(reviewId.toString());
                const [movieResponse, userDetails] = yield Promise.all([
                    yield Movie_1.Movie.findById(review.movieId.toString()),
                    (0, getCountDetails_1.getUserDetails)(review.userId.toString())
                ]);
                if (!movieResponse || !userDetails) {
                    throw new Error("Failed to fetch movie or user details");
                }
                return {
                    review,
                    movie: movieResponse,
                    user: userDetails,
                };
            }
            catch (err) {
                console.error(`Error fetching details for review ID ${reviewId}:`, err);
                return null;
            }
        }));
        // Await all promises
        const likedReviewDetails = yield Promise.all(likedReviewPromises);
        // Filter out null responses
        const validLikedReviewDetails = likedReviewDetails.filter(detail => detail !== null);
        return res.json({
            likedReviews: validLikedReviewDetails,
        });
    }
    catch (err) {
        console.error('Error fetching user liked review data:', err);
        return res.status(500).json({ message: 'Error fetching liked review details' });
    }
});
exports.getLikedReviewDetails = getLikedReviewDetails;
