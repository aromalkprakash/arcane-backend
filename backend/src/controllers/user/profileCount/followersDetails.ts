import { Request, Response } from 'express';
import { getUserDetails } from './getCountDetails';
import { User } from "../../../models/userModel";

export const getFollowersDetails = async (req: Request, res: Response) => {
    const { username } = req.params;
    

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('followers')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followersPromises = user.followers.map(async (followerId: any) =>
            getUserDetails(followerId).catch(err => {
                console.error(`Error fetching details for follower ID ${followerId}:`, err);
                return null;
            })
        );

        const followersResponse = await Promise.all(followersPromises);

        const followersDetails = followersResponse.filter(res => res);

        return res.json({ followers: followersDetails });
    } catch (err: any) {
        console.error('Error fetching followers details:', err);
        return res.status(500).json({ message: 'Error fetching followers details' });
    }
};
