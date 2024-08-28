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
exports.getWatchlist = exports.getLikedReviewDetails = exports.getFollowingDetails = exports.getUserDetails = exports.getFollowersDetails = exports.getCounts = void 0;
const userModel_1 = require("../../../models/userModel");
const Movie_1 = require("../../../models/Movie");
const getReviewById_1 = require("../../review/getReviewById");
const getCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Find user by username
        const user = yield userModel_1.User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the user's counts with default values for missing fields
        const userCounts = yield userModel_1.User.aggregate([
            { $match: { _id: user._id } },
            {
                $project: {
                    _id: 0,
                    watchListCount: { $size: { $ifNull: ["$watchList", []] } }, //$ifNull if it missing///
                    favoritesCount: { $size: { $ifNull: ["$favorites", []] } },
                    likedReviewsCount: { $size: { $ifNull: ["$likedReviews", []] } },
                    followingCount: { $size: { $ifNull: ["$following", []] } },
                    followersCount: { $size: { $ifNull: ["$followers", []] } },
                },
            },
        ]);
        return res.json(userCounts[0] || {
            watchListCount: 0,
            favoritesCount: 0,
            likedReviewsCount: 0,
            followingCount: 0,
            followersCount: 0,
        });
    }
    catch (err) {
        console.error("Error fetching user counts:", err);
        return res.status(500).json({ message: "Error retrieving user counts" });
    }
});
exports.getCounts = getCounts;
const getFollowersDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('followers')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const followersPromises = user.followers.map((followerId) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, exports.getUserDetails)(followerId).catch(err => {
                console.error(`Error fetching details for follower ID ${followerId}:`, err);
                return null;
            });
        }));
        const followersResponse = yield Promise.all(followersPromises);
        const followersDetails = followersResponse.filter(res => res);
        return res.json({ followers: followersDetails });
    }
    catch (err) {
        console.error('Error fetching followers details:', err);
        return res.status(500).json({ message: 'Error fetching followers details' });
    }
});
exports.getFollowersDetails = getFollowersDetails;
const getUserDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(userId)
            .select('fullName username image username')
            .exec();
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            image: user.image,
        };
    }
    catch (err) {
        console.error(`Error fetching user details for ID ${userId}:`, err);
        return null;
    }
});
exports.getUserDetails = getUserDetails;
const getFollowingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('following')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const followingPromises = user.following.map((followingId) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, exports.getUserDetails)(followingId).catch(err => {
                console.error(`Error fetching details for following ID ${followingId}:`, err);
                return null;
            });
        }));
        // Await all promises
        const [followingResponse] = yield Promise.all([
            Promise.all(followingPromises),
        ]);
        // Process and filter out any null responses
        const followingDetails = followingResponse.filter(res => res).map(res => res);
        return res.json({
            following: followingDetails,
        });
    }
    catch (err) {
        console.error('Error fetching user following data:', err);
        return res.status(500).json({ message: 'Error fetching following details' });
    }
});
exports.getFollowingDetails = getFollowingDetails;
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
                    (0, exports.getUserDetails)(review.userId.toString())
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
const getWatchlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('watchList')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch detailed data from other services
        const watchlistPromises = user.watchList.map((movieId) => __awaiter(void 0, void 0, void 0, function* () {
            const movieDetails = yield Movie_1.Movie.findById(movieId);
            return (movieDetails === null || movieDetails === void 0 ? void 0 : movieDetails.data) || null;
        }));
        // Await all promises
        const watchlistMoviesDetails = (yield Promise.all(watchlistPromises)).filter(movie => movie !== null);
        return res.json({
            user,
            watchList: watchlistMoviesDetails,
        });
    }
    catch (err) {
        console.error('Error fetching user details with populated data:', err);
        return res.status(500).json({ message: 'Error fetching user details' });
    }
});
exports.getWatchlist = getWatchlist;
