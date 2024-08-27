import mongoose from "mongoose";
import { IUserOtpVerification } from "../types/Usertypes";

const UserOtpVerificationSchema = new mongoose.Schema<IUserOtpVerification>({
    userId: { type: "string" },
    otp: { type: "string" },
    createdAt: { type: Date},
    expiresAt: { type: Date}
})

export const UserOtpVerification = mongoose.models?.UserOtpVerification || mongoose.model("UserOtpVerification", UserOtpVerificationSchema);