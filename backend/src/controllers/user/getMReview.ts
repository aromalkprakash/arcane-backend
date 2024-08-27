import { Request, Response } from 'express';
import { User } from "../../models/userModel";

export const getMReview = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        // console.log(userId)
        const user = await User.findById(userId).select('username image fullName');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        // console.log(user)
    } catch (err: any) {
        console.error('Error retrieving user:', err.message);
        res.status(500).json({ message: 'Error retrieving user' });
    }
};


