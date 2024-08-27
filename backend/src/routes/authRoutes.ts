import express from "express";
import { googleLogin } from "../controllers/user/auth/google";
import { login, logout, signup } from "../controllers/user/auth/auth";

import { protectRoute } from "../middleware/protectRoute";
import { getMe } from "../controllers/get";


const router = express.Router();

router.get("/me", protectRoute, getMe);
router.get("/google", googleLogin);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);



export default router;
