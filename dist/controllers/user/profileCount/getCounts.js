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
exports.getCounts = void 0;
const userModel_1 = require("../../../models/userModel");
const getCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Find user by username
        const user = yield userModel_1.User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Get the user's counts with default values for missing fields
        const userCounts = yield userModel_1.User.aggregate([
            { $match: { _id: user._id } },
            {
                $project: {
                    _id: 0,
                    watchListCount: { $size: { $ifNull: ["$watchList", []] } }, //$ifNull if it missing///
                    favoritesCount: { $size: { $ifNull: ["$favorites", []] } },
                    likedReviewsCount: { $size: { $ifNull: ["$likedReviews", []] } },
                    followingCount: { $size: { $ifNull: ["$following", []] } },
                    followersCount: { $size: { $ifNull: ["$followers", []] } },
                },
            },
        ]);
        return res.json(userCounts[0] || {
            watchListCount: 0,
            favoritesCount: 0,
            likedReviewsCount: 0,
            followingCount: 0,
            followersCount: 0,
        });
    }
    catch (err) {
        console.error("Error fetching user counts:", err);
        return res.status(500).json({ message: "Error retrieving user counts" });
    }
});
exports.getCounts = getCounts;
