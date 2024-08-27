import { Request, Response } from "express";
import Message from "../../models/chat-models/Message";

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
