import { Request, Response } from 'express';
import { User } from "../../../models/userModel";

export const searchUsers = async (req: Request, res: Response) => {
    const query = req.query.query as string;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const users = await User.find({ name: { $regex: query, $options: 'i' } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
