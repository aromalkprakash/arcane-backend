import { Request, Response } from "express";
import Conversation from "../../models/chat-models/conversation";
import { getReceiverSocketId, io } from "../../Socket/Socket";
import Message from "../../models/chat-models/Message";

interface CustomRequest extends Request {
    user?: any;
  }

export const sendMessage = async (req: CustomRequest, res: Response) => {
    try {
        const {message} = req.body;
        const {id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message : message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        // await conversation.save();
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]); // it will run in parallel

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            console.log('Emitting newMessage to socket:', receiverSocketId);

            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage);

    } catch (error: any) {
        console.log("Error in send message controller", error.message);
        res.status(500).json({ error: "internal server issue"});
    }
};

