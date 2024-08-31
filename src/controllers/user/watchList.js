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
exports.updateWatchList = void 0;
const userModel_1 = require("../../models/userModel");
const updateWatchList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId, userId, action } = req.body;
    try {
        if (action === 'add') {
            // Add movieId to the user's watchList array
            yield userModel_1.User.findByIdAndUpdate(userId, { $addToSet: { watchList: movieId } });
        }
        else if (action === 'remove') {
            // Remove movieId from the user's watchList array
            yield userModel_1.User.findByIdAndUpdate(userId, { $pull: { watchList: movieId } });
        }
        else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        res.status(200).json({ message: 'Success' });
    }
    catch (error) {
        console.error('Error in updateWatchList:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.updateWatchList = updateWatchList;
