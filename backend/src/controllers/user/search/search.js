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
exports.searchUsers = void 0;
const userModel_1 = require("../../../models/userModel");
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }
    try {
        const users = yield userModel_1.User.find({ name: { $regex: query, $options: 'i' } });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchUsers = searchUsers;
