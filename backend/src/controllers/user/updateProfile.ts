import { User } from "../../models/userModel";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

interface CustomRequest extends Request {
    user?: string; // Assuming userId is a string
}

export const updateProfile = async (req: CustomRequest, res: Response) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { image, coverImage } = req.body;
    const userId = req.user;

    try {
        // Ensure userId is defined and fetch the user
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Password validation
        if ((!newPassword && currentPassword) || (currentPassword && !newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            user.password = await hash(newPassword, 10);
        }

        // Handle image and coverImage upload
        if (image && image !== user.image) {
            if (user.image) {
                const imageId = user.image.split("/").pop()?.split(".")[0];
                if (imageId) {
                    await cloudinary.uploader.destroy(imageId);
                }
            }

            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        if (coverImage && coverImage !== user.coverImage) {
            if (user.coverImage) {
                const coverImageId = user.coverImage.split("/").pop()?.split(".")[0];
                if (coverImageId) {
                    await cloudinary.uploader.destroy(coverImageId);
                }
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImage);
            coverImage = uploadedResponse.secure_url;
        }

        // Update user fields
        user.fullName = fullName ?? user.fullName;
        user.email = email ?? user.email;
        user.username = username ?? user.username;
        user.bio = bio ?? user.bio;
        user.link = link ?? user.link;
        user.image = image ?? user.image;
        user.coverImage = coverImage ?? user.coverImage;

        await user.save();

        // // Exclude password from response
        // user.password = undefined ;  // password is not included in the response

        return res.status(200).json(user);
    } catch (error: any) {
        console.log("Error in updateProfile: ", error.message);
        return res.status(500).json({ error: error.message });
    }
};
