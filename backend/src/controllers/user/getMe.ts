import { Request, Response } from "express";
import { User } from "../../models/userModel";
 
interface CustomRequest extends Request {
    user?: any;
  }
  
export const getMe = async (req: CustomRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
        res.status(200).json(user);
    } catch (error: any) {
        console.log("Error in getMe controller" ,error.message)
        return res.status(500).json({error:"Internal server error"})
    }
}