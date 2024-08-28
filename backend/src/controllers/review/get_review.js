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
exports.getFollowingUsersReview = exports.getReviewsByUser = exports.getReviewByMovie = exports.getReviewById = exports.getAllReviews = void 0;
const Review_1 = require("../../models/Review");
const Movie_1 = require("../../models/Movie");
const userModel_1 = require("../../models/userModel");
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield Review_1.Review.find().sort({ createdAt: -1 });
        if (!reviews.length) {
            // console.log('No reviews found');
            return res.status(404).send({ message: 'No reviews found' });
        }
        // Fetch user data from the User database
        const userIds = reviews.map((review) => review.userId.toString());
        let users = {};
        if (userIds.length > 0) {
            const userResponses = yield userModel_1.User.find({ _id: { $in: userIds } });
            users = userResponses.reduce((acc, user) => {
                acc[user._id.toString()] = user.toObject();
                return acc;
            }, {});
        }
        // Fetch movie data for each review
        const movieIds = reviews.map((review) => review.movieId);
        const movieResponses = yield Promise.all(movieIds.map((movieId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield Movie_1.Movie.findById(movieId).select("title poster").exec();
            }
            catch (err) {
                console.error(`Error fetching movie details for ID ${movieId}:`, err.response ? err.response.data : err.message);
                throw err;
            }
        })));
        const movies = movieResponses.reduce((acc, movie) => {
            if (movie) { // Ensure movie is not undefined
                acc[movie._id.toString()] = movie.toObject();
            }
            return acc;
        }, {});
        // Attach user and movie data to each review
        const reviewsWithUserAndMovies = reviews.map((review) => (Object.assign(Object.assign({}, review.toObject()), { user: users[review.userId.toString()] || {}, movie: movies[review.movieId.toString()] || {} // Map the correct movie
         })));
        res.status(200).json(reviewsWithUserAndMovies);
    }
    catch (err) {
        console.error('Error retrieving reviews:', err.message);
        res.status(500).send({ message: 'Error retrieving reviews', error: err.message });
    }
});
exports.getAllReviews = getAllReviews;
const getReviewById = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.Review.findById(reviewId).exec();
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    }
    catch (error) {
        console.log("Error in getReviewById: ", error.message);
        throw new Error(error.message);
    }
});
exports.getReviewById = getReviewById;
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
const getReviewsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        // Fetch user details by username
        const user = yield userModel_1.User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(404).send({ message: 'User not found' });
        }
        const userId = user._id;
        // Fetch reviews by userId
        const reviews = yield Review_1.Review.find({ userId }).sort({ createdAt: -1 });
        if (!reviews.length) {
            console.log('No reviews found for this user');
            return res.status(404).send({ message: 'No reviews found for this user' });
        }
        // Fetch movie data for each review
        const movieIds = reviews.map((review) => review.movieId);
        const movieResponses = yield Promise.all(movieIds.map((movieId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield Movie_1.Movie.findById(movieId).select("title poster");
            }
            catch (err) {
                console.error(`Error fetching movie details for ID ${movieId}:`, err.response ? err.response.data : err.message);
                throw err;
            }
        })));
        const movies = movieResponses.reduce((acc, movie) => {
            if (movie) { // Ensure movie is not undefined
                acc[movie._id.toString()] = movie.toObject();
            }
            return acc;
        }, {});
        // Attach user and movie data to each review
        const reviewsWithUserAndMovies = reviews.map((review) => (Object.assign(Object.assign({}, review.toObject()), { user: user.toObject(), movie: movies[review.movieId.toString()] || {} })));
        res.status(200).json(reviewsWithUserAndMovies);
    }
    catch (err) {
        console.error('Error retrieving user reviews:', err.message);
        res.status(500).send({ message: 'Error retrieving reviews', error: err.message });
    }
});
exports.getReviewsByUser = getReviewsByUser;
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
