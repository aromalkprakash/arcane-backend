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
exports.getUReview = exports.getMovieDetails = exports.getAllMovies = void 0;
const Movie_1 = require("../../models/Movie");
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.Movie.find().sort({ createdAt: -1 });
        res.status(200).json(movies);
    }
    catch (error) {
        console.error(error, "Error in getAllMovie controller");
        res.status(500).json({ error: "Internal server issue" });
    }
});
exports.getAllMovies = getAllMovies;
const getMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    console.log("movieId for count:", movieId);
    try {
        const movie = yield Movie_1.Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.status(200).json(movie);
    }
    catch (error) {
        console.log("Error in getMovieDetails: ", error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getMovieDetails = getMovieDetails;
const getUReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const movie = yield Movie_1.Movie.findById(movieId).select("title poster");
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    }
    catch (err) {
        console.error("Error retrieving movie:", err.message);
        res.status(500).send({ message: "Error retrieving movie" });
    }
});
exports.getUReview = getUReview;
