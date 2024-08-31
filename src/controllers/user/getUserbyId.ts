import { Request, Response } from 'express';
import { User } from "../../models/userModel";

export const getUserDetails = async (req: Request, res: Response) => {
    
    const { userId } = req.params;
    
    try {
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ error: "User not found" });
      }
      
        res.status(200).json(user);
    } catch (error: any) {
        console.log("Error in getUserDetails: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
