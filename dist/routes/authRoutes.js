"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_1 = require("../controllers/user/auth/google");
const login_1 = require("../controllers/user/auth/login");
const logout_1 = require("../controllers/user/auth/logout");
const signup_1 = require("../controllers/user/auth/signup");
const getMe_1 = require("../controllers/user/getMe");
const protectRoute_1 = require("../middleware/protectRoute");
const router = express_1.default.Router();
router.get("/me", protectRoute_1.protectRoute, getMe_1.getMe);
router.get("/google", google_1.googleLogin);
router.post("/signup", signup_1.signup);
router.post("/login", login_1.login);
router.post("/logout", logout_1.logout);
exports.default = router;
