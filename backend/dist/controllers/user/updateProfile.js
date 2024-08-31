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
exports.updateProfile = void 0;
const userModel_1 = require("../../models/userModel");
const bcrypt_1 = require("bcrypt");
const cloudinary_1 = require("cloudinary");
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { image, coverImage } = req.body;
    const userId = req.user;
    try {
        // Ensure userId is defined and fetch the user
        if (!userId)
            return res.status(400).json({ message: "User ID is required" });
        let user = yield userModel_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Password validation
        if ((!newPassword && currentPassword) || (currentPassword && !newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }
        if (currentPassword && newPassword) {
            const isMatch = yield (0, bcrypt_1.compare)(currentPassword, user.password);
            if (!isMatch)
                return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            user.password = yield (0, bcrypt_1.hash)(newPassword, 10);
        }
        // Handle image and coverImage upload
        if (image && image !== user.image) {
            if (user.image) {
                const imageId = (_a = user.image.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
                if (imageId) {
                    yield cloudinary_1.v2.uploader.destroy(imageId);
                }
            }
            const uploadedResponse = yield cloudinary_1.v2.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }
        if (coverImage && coverImage !== user.coverImage) {
            if (user.coverImage) {
                const coverImageId = (_b = user.coverImage.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split(".")[0];
                if (coverImageId) {
                    yield cloudinary_1.v2.uploader.destroy(coverImageId);
                }
            }
            const uploadedResponse = yield cloudinary_1.v2.uploader.upload(coverImage);
            coverImage = uploadedResponse.secure_url;
        }
        // Update user fields
        user.fullName = fullName !== null && fullName !== void 0 ? fullName : user.fullName;
        user.email = email !== null && email !== void 0 ? email : user.email;
        user.username = username !== null && username !== void 0 ? username : user.username;
        user.bio = bio !== null && bio !== void 0 ? bio : user.bio;
        user.link = link !== null && link !== void 0 ? link : user.link;
        user.image = image !== null && image !== void 0 ? image : user.image;
        user.coverImage = coverImage !== null && coverImage !== void 0 ? coverImage : user.coverImage;
        yield user.save();
        // // Exclude password from response
        // user.password = undefined ;  // password is not included in the response
        return res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in updateProfile: ", error.message);
        return res.status(500).json({ error: error.message });
    }
});
exports.updateProfile = updateProfile;
