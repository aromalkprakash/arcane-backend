import { Request, Response } from "express";
import axios from "axios";
import { oauth2client } from "../../../lib/utils/googleConfig";
import { generateTokenAndSetCookie } from "../../../lib/generateTokenAndSetCookie";
import { User } from "../../../models/userModel";


const generateRandomUsername = (): string => {
  const adjectives = ['xgvucv', 'filmsbd', 'spookcnma', 'cccvcjj', ' ahcsuhcad'];
  const nouns = ['csvcsy', 'enthuscc', 'bbebdgx', 'bcdhcvh', 'vcvvscgt'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

export const googleLogin = async (req: Request, res: Response) => {
  console.log("googleLogin function called");

  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "No code provided" });
    }

    console.log("Received auth code:", code);

    // Exchange the authorization code for tokens
    const googleRes= await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    console.log("Google tokens received:", googleRes.tokens);

    // Fetch user info from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    console.log("User Info Response:", userRes.data);

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      console.log("Creating a new user...");
      user = await User.create({
        fullName: name,
        email,
        image: picture,
        googleId: googleRes.tokens.id_token,
        username: generateRandomUsername(),
      });
      await user.save();
      console.log("User created and saved to the database");
    } else {
      console.log("User already exists:", user);
    }

    // Generate JWT and set it in a cookie
    generateTokenAndSetCookie(user._id.toString(), res);

    // Respond with user data
    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error: any) {
    console.error("Error in Google login:", error.message);
    console.error("Full error object:", error);
    return res
      .status(500)
      .json({
        message:
          "Error in Google login: " +
          (error.response?.data?.message || error.message),
      });
  }
};
