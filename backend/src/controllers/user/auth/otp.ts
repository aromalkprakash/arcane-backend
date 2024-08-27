import nodemailer from "nodemailer";
import { Response } from "express";
import { hash } from "bcrypt";
import { UserOtpVerification } from "../../../models/UserOtpVerification";

interface SendOTPVerificationEmailProps {
    _id: string;
    email: string;
    res: Response;
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

export const sendOTPVerificationEmail = async ({ _id, email, res }: SendOTPVerificationEmailProps) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'OTP Verification',
            html: `<p>Your OTP is <b>${otp}</b>. Please enter this OTP to verify your account.</p>
                   <p>This code will <b>expire in 1 hour</b>.</p>`,
        };

        const hashOtp = await hash(otp, 10);

        const newOtpVerification = new UserOtpVerification({
            userId: _id,
            otp: hashOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000) // 1 hour
        });

        await newOtpVerification.save();

        await transporter.sendMail(mailOptions);
        res.json({
            success: "PENDING",
            message: "OTP has been sent to your email",
            data: {
                userId: _id,
                email,
            },
        });

    } catch (error: any) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
};
