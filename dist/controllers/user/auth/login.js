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
exports.login = void 0;
const bcrypt_1 = require("bcrypt");
const userModel_1 = require("../../../models/userModel");
const generateTokenAndSetCookie_1 = require("../../../lib/generateTokenAndSetCookie");
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
