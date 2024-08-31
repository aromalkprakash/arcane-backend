import express from "express";
import { getUReview } from "../controllers/movie/getUReview";
import { getAllMovies } from "../controllers/movie/getAllMovies";
import { getMovieDetails } from "../controllers/movie/getmovieDetails";
import { addMovie } from "../controllers/movie/addMovies";
import { updateMovie } from "../controllers/movie/updateMovie";
import { fetchMovies } from "../controllers/movie/search/searchMovies";


const router = express.Router();

router.get("/getreviewforpp/:movieId", getUReview);
router.get("/getallmovies", getAllMovies);
router.get("/searchallmovies", fetchMovies);
router.get("/getmoviedetails/:movieId", getMovieDetails);

router.post("/addmovie", addMovie);
router.post("/updatemovie/:movieId", updateMovie);

export default router;
