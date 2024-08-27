import { Request, Response } from 'express';
import { User } from "../../../models/userModel";

interface CustomRequest extends Request {
    user?: any;
}

export const unFollow = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUserId = await User.findById(req.user._id);

        if (!userToModify || !currentUserId) return res.status(400).json({ error: "User not found" });


        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unFollow yourself" });
        }

        // Add unfollow logic here
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
};