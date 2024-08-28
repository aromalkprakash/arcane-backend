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
exports.logout = exports.login = exports.signup = void 0;
const bcrypt_1 = require("bcrypt");
const userModel_1 = require("../../../models/userModel");
const generateTokenAndSetCookie_1 = require("../../../lib/generateTokenAndSetCookie");
const bcrypt_2 = require("bcrypt");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        if (!body.fullName || !body.username || !body.password || !body.email) {
            return res.json({ message: "Please provide all fields" });
        }
        ;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        ;
        const filter = { username: body.username };
        const user = yield userModel_1.User.findOne(filter);
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield (0, bcrypt_2.hash)(body.password, 10);
        const newUser = new userModel_1.User(Object.assign(Object.assign({}, body), { password: hashedPassword }));
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(newUser._id, res);
        yield newUser.save();
        return res.status(201).json({ message: "User is created", user: newUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in creating user: " + error.message });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Log request body for debugging
        // console.log("Request body:", req.body);
        // Check if both username and password are provided
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }
        const user = yield userModel_1.User.findOne({ username }).select("+password");
        if (!user) {
            return res
                .status(400)
                .json({ error: "No user found with this username" });
        }
        const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password does not match" });
        }
        // Generate token and set cookie
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(user._id.toString(), res);
        // Return user details
        return res.status(200).json({
            fullName: user.fullName,
            role: user.role,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal server issue" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.logout = logout;
