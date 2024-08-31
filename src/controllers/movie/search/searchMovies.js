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
exports.fetchMovies = void 0;
const Movie_1 = require("../../../models/Movie");
const fetchMovies = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!query) {
        throw new Error('Query is required');
    }
    try {
        // Perform the search
        return yield Movie_1.Movie.find({ title: { $regex: query, $options: "i" }, }).exec();
    }
    catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Internal server error');
    }
});
exports.fetchMovies = fetchMovies;
