import { compare } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/userModel";
import { generateTokenAndSetCookie } from "../../../lib/generateTokenAndSetCookie";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Log request body for debugging
    // console.log("Request body:", req.body);

    // Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ error: "No user found with this username" });
    }


    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Password does not match" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id.toString(), res);

    // Return user details
    return res.status(200).json({
      fullName: user.fullName,
      role: user.role,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server issue" });
  }
};
