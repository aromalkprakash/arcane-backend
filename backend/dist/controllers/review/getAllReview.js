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
exports.getAllReviews = void 0;
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
