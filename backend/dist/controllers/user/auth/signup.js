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
exports.signup = void 0;
const bcrypt_1 = require("bcrypt");
const userModel_1 = require("../../../models/userModel");
const generateTokenAndSetCookie_1 = require("../../../lib/generateTokenAndSetCookie");
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
        const hashedPassword = yield (0, bcrypt_1.hash)(body.password, 10);
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
