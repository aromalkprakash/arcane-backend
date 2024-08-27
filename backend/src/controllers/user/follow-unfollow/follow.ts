import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
// import {notifyUser} from "../../api/notification"
interface CustomRequest extends Request {
    user?: any;
}

export const follow = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUserId = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow/unFollow yourself" });
        }

        // Add follow logic here
        await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
        await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

        // await notifyUser('follow', req.user._id, userToModify._id);

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to follow user' });
    }
};