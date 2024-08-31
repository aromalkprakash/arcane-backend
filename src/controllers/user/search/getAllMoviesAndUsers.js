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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAll = void 0;
const getUsers_1 = require("./getUsers"); // Adjust import path to match your project structure
const searchMovies_1 = require("../../movie/search/searchMovies");
const searchAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.query;
    console.log("qqqqqqqqqqq", query);
    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }
    try {
        // Use Promise.all to run fetchUsers and axios.get in parallel
        const [users, movies] = yield Promise.all([
            (0, getUsers_1.fetchUsers)(query), // Call fetchUsers directly with query
            (0, searchMovies_1.fetchMovies)(query)
        ]);
        // Respond with the combined data
        return res.json({
            users,
            movies
        });
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
exports.searchAll = searchAll;
