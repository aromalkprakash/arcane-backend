import { Request, Response } from 'express';
import { getUserDetails } from "./getCountDetails";
import { User } from "../../../models/userModel";

export const getFollowingDetails = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('following')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingPromises = user.following.map(async (followingId: any) =>
            getUserDetails(followingId).catch(err => {
                console.error(`Error fetching details for following ID ${followingId}:`, err);
                return null;
            })
        );


        // Await all promises
        const [followingResponse] = await Promise.all([
            Promise.all(followingPromises),

        ]);

        // Process and filter out any null responses

        const followingDetails = followingResponse.filter(res => res).map(res => res);

        return res.json({
            following: followingDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user following data:', err);
        return res.status(500).json({ message: 'Error fetching following details' });
    }
};