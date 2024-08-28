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
exports.getFollowingDetails = void 0;
const getCountDetails_1 = require("./getCountDetails");
const userModel_1 = require("../../../models/userModel");
const getFollowingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('following')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const followingPromises = user.following.map((followingId) => __awaiter(void 0, void 0, void 0, function* () {
            return (0, getCountDetails_1.getUserDetails)(followingId).catch(err => {
                console.error(`Error fetching details for following ID ${followingId}:`, err);
                return null;
            });
        }));
        // Await all promises
        const [followingResponse] = yield Promise.all([
            Promise.all(followingPromises),
        ]);
        // Process and filter out any null responses
        const followingDetails = followingResponse.filter(res => res).map(res => res);
        return res.json({
            following: followingDetails,
        });
    }
    catch (err) {
        console.error('Error fetching user following data:', err);
        return res.status(500).json({ message: 'Error fetching following details' });
    }
});
exports.getFollowingDetails = getFollowingDetails;
