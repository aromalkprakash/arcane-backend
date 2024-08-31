import { Request, Response } from "express";
import Conversation from "../../models/chat-models/conversation";



interface CustomRequest extends Request {
    user?: any;
}

export const getMessage = async (req: CustomRequest, res: Response) => {
    try {
        const { id: userToChat } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChat] }
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);
        
        const messages = conversation.messages;
        // console.log(messages)
        res.status(200).json(messages);
    } catch (error: any) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({ error: "Internal server issue" });
    }
};
