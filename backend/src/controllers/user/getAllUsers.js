"use strict";
// User-service/getAllUsers.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const userModel_1 = require("../../models/userModel");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.User.find();
        if (!users) {
            return res.status(404).json({ error: "Users not found//" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error in getallusers: ", error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
