import { Server, Socket } from "socket.io";
import http from 'http';
import express from "express";

// Define interfaces for better type checking
interface UserSocketMap {
    [userId: string]: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"], 
        methods: ["GET", "POST"],
        credentials: true
    },
});


export const getReceiverSocketId = (receiverId: string): string | undefined => {
    return userSocketMap[receiverId];
}

const userSocketMap: UserSocketMap = {}; // {userId: socketId}

io.on('connection', (socket: Socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    if (userId && userId != "undefined") {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
