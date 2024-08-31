// User-service/getAllUsers.ts

import { Request, Response } from 'express';
import { User } from "../../models/userModel";

export const getAllUsers = async (req: Request, res: Response) => {
    
    try {
        const users = await User.find()
        if (!users) {
            return res.status(404).json({ error: "Users not found//" });
      }
      
        res.status(200).json(users);
    } catch (error: any) {
        console.log("Error in getallusers: ", error.message);
        res.status(500).json({ error: error.message });
    }
};
