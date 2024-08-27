import express from "express";
import { getMessage } from "../controllers/chat/getMessage";
import { sendMessage } from "../controllers/chat/sendMessage";
import { protectRoute } from "../middleware/protectRoute";
import { deleteMessage } from "../controllers/chat/deleteMessage";

// import { getChatUsers } from "../controllers/getUsersList";

const router = express.Router();
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/messages/:id", deleteMessage);


// router.get("/getchatusers", getChatUsers);

export default router;
