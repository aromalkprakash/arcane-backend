import { Request, Response } from 'express';
import { User } from "../models/userModel";

interface CustomRequest extends Request {
    user?: any;
  }
  

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



export const getMe = async (req: CustomRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        console.log("Error in getMe controller", error.message)
        return res.status(500).json({ error: "Internal server error" })
    }
};


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


export const getUserByUsername = async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err: any) {
      console.error('Error retrieving user:', err.message);
      res.status(500).send({ message: 'Error retrieving user' });
    }
  };
  
  