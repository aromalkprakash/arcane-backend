import { Request, Response } from 'express';
import { User } from "../../models/userModel";

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

