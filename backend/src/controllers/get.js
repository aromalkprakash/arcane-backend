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
exports.getUserByUsername = exports.getUserDetails = exports.getMReview = exports.getMe = exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        if (!users) {
            return res.status(404).json({ error: "Users not found//" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error in getallusers: ", error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in getMe controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMe = getMe;
const getMReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // console.log(userId)
        const user = yield userModel_1.User.findById(userId).select('username image fullName');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        // console.log(user)
    }
    catch (err) {
        console.error('Error retrieving user:', err.message);
        res.status(500).json({ message: 'Error retrieving user' });
    }
});
exports.getMReview = getMReview;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in getUserDetails: ", error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getUserDetails = getUserDetails;
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
