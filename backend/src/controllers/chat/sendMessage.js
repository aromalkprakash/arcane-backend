"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const conversation_1 = __importDefault(require("../../models/chat-models/conversation"));
const Socket_1 = require("../../Socket/Socket");
const Message_1 = __importDefault(require("../../models/chat-models/Message"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let conversation = yield conversation_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = yield conversation_1.default.create({
                participants: [senderId, receiverId]
            });
        }
        const newMessage = new Message_1.default({
            senderId,
            receiverId,
            message: message,
        });
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        yield Promise.all([conversation.save(), newMessage.save()]); // it will run in parallel
        const receiverSocketId = (0, Socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            console.log('Emitting newMessage to socket:', receiverSocketId);
            Socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in send message controller", error.message);
        res.status(500).json({ error: "internal server issue" });
    }
});
exports.sendMessage = sendMessage;
