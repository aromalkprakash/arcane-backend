import express from "express";
import { addMovie } from "../controllers/movie/addMovies";
import { updateMovie } from "../controllers/movie/updateMovie";
import { fetchMovies } from "../controllers/movie/search/searchMovies";
import { getAllMovies, getMovieDetails, getUReview } from "../controllers/movie/get_movie";


const router = express.Router();

router.get("/getreviewforpp/:movieId", getUReview);
router.get("/getallmovies", getAllMovies);
router.get("/searchallmovies", fetchMovies);
router.get("/getmoviedetails/:movieId", getMovieDetails);

router.post("/addmovie", addMovie);
router.post("/updatemovie/:movieId", updateMovie);

export default router;
