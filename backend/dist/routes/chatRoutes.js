"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getMessage_1 = require("../controllers/chat/getMessage");
const sendMessage_1 = require("../controllers/chat/sendMessage");
const protectRoute_1 = require("../middleware/protectRoute");
const deleteMessage_1 = require("../controllers/chat/deleteMessage");
// import { getChatUsers } from "../controllers/getUsersList";
const router = express_1.default.Router();
router.get("/:id", protectRoute_1.protectRoute, getMessage_1.getMessage);
router.post("/send/:id", protectRoute_1.protectRoute, sendMessage_1.sendMessage);
router.delete("/messages/:id", deleteMessage_1.deleteMessage);
// router.get("/getchatusers", getChatUsers);
exports.default = router;
