import express from "express";
import { googleLogin } from "../controllers/user/auth/google";
import { login } from "../controllers/user/auth/login";
import { logout } from "../controllers/user/auth/logout";
import { signup } from "../controllers/user/auth/signup";
import { getMe } from "../controllers/user/getMe";
import { protectRoute } from "../middleware/protectRoute";


const router = express.Router();

router.get("/me", protectRoute, getMe);
router.get("/google", googleLogin);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);



export default router;
