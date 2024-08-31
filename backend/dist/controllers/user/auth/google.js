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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const googleConfig_1 = require("../../../lib/utils/googleConfig");
const generateTokenAndSetCookie_1 = require("../../../lib/generateTokenAndSetCookie");
const userModel_1 = require("../../../models/userModel");
const generateRandomUsername = () => {
    const adjectives = ['xgvucv', 'filmsbd', 'spookcnma', 'cccvcjj', ' ahcsuhcad'];
    const nouns = ['csvcsy', 'enthuscc', 'bbebdgx', 'bcdhcvh', 'vcvvscgt'];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
};
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("googleLogin function called");
    try {
        const { code } = req.query;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ message: "No code provided" });
        }
        console.log("Received auth code:", code);
        // Exchange the authorization code for tokens
        const googleRes = yield googleConfig_1.oauth2client.getToken(code);
        googleConfig_1.oauth2client.setCredentials(googleRes.tokens);
        console.log("Google tokens received:", googleRes.tokens);
        // Fetch user info from Google
        const userRes = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        const { email, name, picture } = userRes.data;
        console.log("User Info Response:", userRes.data);
        // Find or create user
        let user = yield userModel_1.User.findOne({ email });
        if (!user) {
            console.log("Creating a new user...");
            user = yield userModel_1.User.create({
                fullName: name,
                email,
                image: picture,
                googleId: googleRes.tokens.id_token,
                username: generateRandomUsername(),
            });
            yield user.save();
            console.log("User created and saved to the database");
        }
        else {
            console.log("User already exists:", user);
        }
        // Generate JWT and set it in a cookie
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(user._id.toString(), res);
        // Respond with user data
        return res
            .status(200)
            .json({ message: "User logged in successfully", user });
    }
    catch (error) {
        console.error("Error in Google login:", error.message);
        console.error("Full error object:", error);
        return res
            .status(500)
            .json({
            message: "Error in Google login: " +
                (((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message),
        });
    }
});
exports.googleLogin = googleLogin;
