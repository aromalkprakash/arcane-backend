import { Request, Response } from "express";

export const logout = async (req:Request , res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
        
    }
}