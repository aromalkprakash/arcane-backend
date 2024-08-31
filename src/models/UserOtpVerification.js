"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOtpVerification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserOtpVerificationSchema = new mongoose_1.default.Schema({
    userId: { type: "string" },
    otp: { type: "string" },
    createdAt: { type: Date },
    expiresAt: { type: Date }
});
exports.UserOtpVerification = ((_a = mongoose_1.default.models) === null || _a === void 0 ? void 0 : _a.UserOtpVerification) || mongoose_1.default.model("UserOtpVerification", UserOtpVerificationSchema);
