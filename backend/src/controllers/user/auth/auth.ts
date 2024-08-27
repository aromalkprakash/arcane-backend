import { compare } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../../../models/userModel";
import { generateTokenAndSetCookie } from "../../../lib/generateTokenAndSetCookie";
import { hash } from "bcrypt";


interface SignUpBody {
    body:{
    fullName: string;
    username: string;
    email: string;
    password: string;
        role: string;
    }
}

export const signup = async (req: SignUpBody, res: any) => {
    try {
        const { body }: SignUpBody = req;

        if (!body.fullName || !body.username || !body.password || !body.email) {
            return res.json({ message: "Please provide all fields" },);
        };

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(body.email)) {
            return res.status(400).json({ error: "Invalid email format" });
        };

       
        const filter = { username: body.username };
        const user = await User.findOne(filter);

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await hash(body.password, 10);
        const newUser = new User({ ...body, password: hashedPassword });
     
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            return res.status(201).json({ message: "User is created", user: newUser });
        
    } catch (error: any) {
        return res.status(500).json({ message: "Error in creating user: " + error.message });
    }
};


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


export const logout = async (req:Request , res: Response) => {
  try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ error: "Internal server error" });
      
  }
}