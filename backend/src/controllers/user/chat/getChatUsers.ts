import {User }from "../../../models/userModel"
import {Request, Response} from "express"

interface CustomRequest extends Request {
    user?: any;
  }

export const getChatUser = async (req: CustomRequest, res: Response) => {
    const userId = req.params;

    try {
        const user = await User.findById(userId).select('_id fullName image'); // only necessary fields
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

