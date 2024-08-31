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
exports.getUserByUsername = void 0;
const userModel_1 = require("../../models/userModel");
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const user = yield userModel_1.User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error('Error retrieving user:', err.message);
        res.status(500).send({ message: 'Error retrieving user' });
    }
});
exports.getUserByUsername = getUserByUsername;
