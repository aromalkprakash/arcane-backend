import { Request, Response } from 'express';
import Notification from "../models/notification";

export const createNotification = async (req: Request, res: Response) => {
    const { type, from, to } = req.body;

    try {
        if (!type || !from || !to) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newNotification = new Notification({ type, from, to });
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

