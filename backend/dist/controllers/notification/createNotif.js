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
exports.createNotification = void 0;
const notification_1 = __importDefault(require("../../models/notification"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, from, to } = req.body;
    try {
        if (!type || !from || !to) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newNotification = new notification_1.default({ type, from, to });
        yield newNotification.save();
        res.status(201).json(newNotification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
});
exports.createNotification = createNotification;
