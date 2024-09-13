import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";
import reviewRoutes from "./routes/reviewRoutes"
import movieRoutes from "./routes/movieRoutes";
import chatRoutes from "./routes/chatRoutes";
import { app, server } from "./Socket/Socket";
import connectDb from "./lib/db/ConnectDb";


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const HOST = '0.0.0.0';

const PORT = Number( process.env.PORT || 5000 );
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 


app.use(express.json({limit:"5mb"}));  
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); 

app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/chat", chatRoutes);


server.listen(PORT, HOST, () => {
  console.log(`arcane backend server listening on port ${PORT}`);
});

connectDb();

