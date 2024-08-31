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
exports.getAllMovies = void 0;
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
