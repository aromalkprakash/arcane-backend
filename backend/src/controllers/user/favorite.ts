import {Request, Response} from "express"
import { User } from "../../models/userModel";

export const updateFavorite = async (req: Request, res: Response) => {
    
    const { movieId, userId, action } = req.body;

    try {
        if (action === 'addToFavorite') {
            // Add movieId to the user's watchList array
            await User.findByIdAndUpdate(userId, { $addToSet: { favorites: movieId } });
        } else if (action === 'removeFromFavorite') {
            // Remove movieId from the user's watchList array
            await User.findByIdAndUpdate(userId, { $pull: { favorites: movieId } });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error in updateFavorite:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

