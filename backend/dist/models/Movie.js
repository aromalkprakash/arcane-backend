"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    poster: { type: String },
    bannerImg: { type: String },
    description: { type: String },
    releaseYear: { type: String },
    genre: [{ type: String }],
    duration: { type: String },
    director: [{ type: String }],
    actors: [{ type: String }],
    trailer: { type: String },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
exports.Movie = ((_a = mongoose_1.default.models) === null || _a === void 0 ? void 0 : _a.Movie) || mongoose_1.default.model("Movie", movieSchema);
