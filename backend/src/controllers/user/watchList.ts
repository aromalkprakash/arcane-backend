import {Request, Response} from "express"
import { User } from "../../models/userModel";

export const updateWatchList = async (req: Request, res: Response) => {
    
    const { movieId, userId, action } = req.body;

    try {
        if (action === 'add') {
            // Add movieId to the user's watchList array
            await User.findByIdAndUpdate(userId, { $addToSet: { watchList: movieId } });
        } else if (action === 'remove') {
            // Remove movieId from the user's watchList array
            await User.findByIdAndUpdate(userId, { $pull: { watchList: movieId } });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error in updateWatchList:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

