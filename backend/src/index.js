"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const Usersdb_1 = __importDefault(require("./lib/db/Usersdb"));
const Socket_1 = require("./Socket/Socket");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const PORT = process.env.PORT || 4000;
Socket_1.app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
Socket_1.app.use(express_1.default.json({ limit: "5mb" }));
Socket_1.app.use(express_1.default.urlencoded({ extended: true }));
Socket_1.app.use((0, cookie_parser_1.default)());
Socket_1.app.use("/api/auth", authRoutes_1.default);
Socket_1.app.use("/api/users", usersRoutes_1.default);
Socket_1.app.use("/api/review", reviewRoutes_1.default);
Socket_1.app.use("/api/movie", movieRoutes_1.default);
Socket_1.app.use("/api/chat", chatRoutes_1.default);
Socket_1.server.listen(PORT, () => {
    console.log(`Users server listening on port ${PORT}`);
});
(0, Usersdb_1.default)();
