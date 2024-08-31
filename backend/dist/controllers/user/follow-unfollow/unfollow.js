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
exports.unFollow = void 0;
const userModel_1 = require("../../../models/userModel");
const unFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userToModify = yield userModel_1.User.findById(id);
        const currentUserId = yield userModel_1.User.findById(req.user._id);
        if (!userToModify || !currentUserId)
            return res.status(400).json({ error: "User not found" });
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unFollow yourself" });
        }
        // Add unfollow logic here
        yield userModel_1.User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        yield userModel_1.User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
        res.status(200).json({ message: 'User unfollowed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});
exports.unFollow = unFollow;
