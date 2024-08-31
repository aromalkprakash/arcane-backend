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
exports.sendOTPVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = require("bcrypt");
const UserOtpVerification_1 = require("../../../models/UserOtpVerification");
let transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});
const sendOTPVerificationEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, email, res }) {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'OTP Verification',
            html: `<p>Your OTP is <b>${otp}</b>. Please enter this OTP to verify your account.</p>
                   <p>This code will <b>expire in 1 hour</b>.</p>`,
        };
        const hashOtp = yield (0, bcrypt_1.hash)(otp, 10);
        const newOtpVerification = new UserOtpVerification_1.UserOtpVerification({
            userId: _id,
            otp: hashOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000) // 1 hour
        });
        yield newOtpVerification.save();
        yield transporter.sendMail(mailOptions);
        res.json({
            success: "PENDING",
            message: "OTP has been sent to your email",
            data: {
                userId: _id,
                email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});
exports.sendOTPVerificationEmail = sendOTPVerificationEmail;
