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
exports.updateMovie = void 0;
const Movie_1 = require("../../models/Movie");
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const { title, description, genre, duration, director, releaseYear, trailer, poster, bannerImg, } = req.body;
    try {
        const movie = yield Movie_1.Movie.findByIdAndUpdate(movieId, {
            title,
            description,
            genre,
            duration,
            director,
            releaseYear,
            trailer,
            poster,
            bannerImg,
        }, { new: true });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateMovie = updateMovie;
