"use strict";
// import express from "express";
// import Message from "../model/Message";
// import axios from "axios";
// import { Request, Response } from "express";
// import mongoose from "mongoose";
// // Replace with your User service URL
// const USER_SERVICE_URL = "http://localhost:8080/api/users";
// // Get user details based on the latest messages
// export const getChatUsers = async (req: Request, res: Response) => {
//   try {
//     // Fetch latest messages sorted by timestamp
//     const messages = await Message.find()
//       .sort({ createdAt: -1 }) // Sort by timestamp in descending order
//     // Extract sender IDs from messages and ensure they are valid ObjectIds
//     const senderIds = Array.from(new Set(messages.map(message => {
//       return mongoose.Types.ObjectId.isValid(message.senderId) ? message.senderId.toString() : null;
//     }).filter(id => id !== null))); // Remove invalid ObjectId strings
//     if (senderIds.length === 0) {
//       return res.json([]);
//       }
//       console.log(senderIds)
//     // Fetch user details from User service
//     const userDetailsPromises = senderIds.map(userId =>
//       axios.get(`${USER_SERVICE_URL}/${userId}`)
//     );
//     const userResponses = await Promise.all(userDetailsPromises);
//     const userDetails = userResponses.map(response => response.data);
//     res.json(userDetails);
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
