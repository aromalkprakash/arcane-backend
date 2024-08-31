"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    fullName: { type: "string" },
    email: { type: "string", required: true, unique: true },
    username: { type: "string", unique: true },
    role: { type: "string", default: "USER" },
    image: { type: "string", default: "" },
    coverImage: { type: "string", default: "" },
    googleId: { type: "string", },
    password: { type: "string", select: false },
    bio: { type: "string", default: "" },
    watchList: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Movie", default: [] }],
    favorites: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Movie", default: [] }],
    likedReviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review", default: [] }],
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] }],
    verified: { type: Boolean }
}, { timestamps: true });
exports.User = ((_a = mongoose_1.default.models) === null || _a === void 0 ? void 0 : _a.User) || mongoose_1.default.model("User", UserSchema);
