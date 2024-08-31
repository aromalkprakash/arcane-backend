import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

interface CustomRequest extends Request {
  user?: any;
}

interface JwtPayload {
  userId: string;
}

export const protectRoute = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "No token//" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err: any) {
    console.error("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
