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
exports.getReviewsByUser = void 0;
const Review_1 = require("../../models/Review");
const userModel_1 = require("../../models/userModel");
const Movie_1 = require("../../models/Movie");
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
