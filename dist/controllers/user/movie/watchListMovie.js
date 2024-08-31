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
exports.getWatchlistDetails = void 0;
const userModel_1 = require("../../../models/userModel");
const Movie_1 = require("../../../models/Movie");
const getWatchlistDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        // Fetch user with basic details
        const user = yield userModel_1.User.findOne({ username })
            .select('watchList')
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch detailed data from other services
        const watchListPromises = user.watchList.map((movieId) => __awaiter(void 0, void 0, void 0, function* () { return yield Movie_1.Movie.findById(movieId.toString()); }));
        // Await all promises
        const [watchListResponse] = yield Promise.all([
            Promise.all(watchListPromises),
        ]);
        // Process and filter out any null responses
        const watchListDetails = watchListResponse.filter(res => res && res.data).map(res => res === null || res === void 0 ? void 0 : res.data);
        return res.json({
            watchList: watchListDetails,
        });
    }
    catch (err) {
        console.error('Error fetching user details with populated data:', err);
        return res.status(500).json({ message: 'Error fetching watchlist movie details' });
    }
});
exports.getWatchlistDetails = getWatchlistDetails;
