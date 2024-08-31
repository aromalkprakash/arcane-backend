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
exports.addMovie = void 0;
const cloudinary_1 = require("cloudinary");
const Movie_1 = require("../../models/Movie");
const addMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        console.log(body);
        if (!body.title || !body.description) {
            return res
                .status(400)
                .json({ error: "Movie details must have title & description" });
        }
        let posterUrl;
        let bannerUrl;
        if (body.poster) {
            try {
                const uploadedResponse = yield cloudinary_1.v2.uploader.upload(body.poster);
                posterUrl = uploadedResponse.secure_url;
            }
            catch (error) {
                console.error("Error uploading poster to Cloudinary:", error);
                return res
                    .status(500)
                    .json({ error: "Internal server error (Cloudinary upload)" });
            }
        }
        if (body.bannerImg) {
            try {
                const uploadedResponse = yield cloudinary_1.v2.uploader.upload(body.bannerImg);
                bannerUrl = uploadedResponse.secure_url;
            }
            catch (error) {
                console.error("Error uploading banner to Cloudinary:", error);
                return res
                    .status(500)
                    .json({ error: "Internal server error (Cloudinary upload)" });
            }
        }
        const newMovie = new Movie_1.Movie(Object.assign(Object.assign({}, body), { poster: posterUrl, bannerImg: bannerUrl }));
        yield newMovie.save();
        res.status(201).json(newMovie);
    }
    catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addMovie = addMovie;
