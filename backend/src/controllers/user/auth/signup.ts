import { hash } from "bcrypt";
import { User} from "../../../models/userModel";
import { generateTokenAndSetCookie } from "../../../lib/generateTokenAndSetCookie";

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