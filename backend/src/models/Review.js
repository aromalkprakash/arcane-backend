"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, },
    movieId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Movie', required: true, },
    rating: { type: Number, min: 0, max: 10, },
    review: { type: String, },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
exports.Review = ((_a = mongoose_1.default.models) === null || _a === void 0 ? void 0 : _a.Review) || mongoose_1.default.model("Review", reviewSchema);
