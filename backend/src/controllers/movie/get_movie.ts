import { Request, Response } from "express";
import { Movie } from "../../models/Movie";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    console.error(error, "Error in getAllMovie controller");
    res.status(500).json({ error: "Internal server issue" });
  }
};


export const getMovieDetails = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    console.log("movieId for count:", movieId);
  
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      res.status(200).json(movie);
    } catch (error: any) {
      console.log("Error in getMovieDetails: ", error.message);
      res.status(500).json({ error: error.message });
    }
};
  

export const getUReview = async (req: Request, res: Response) => {
    try {
      const { movieId } = req.params;
      const movie = await Movie.findById(movieId).select("title poster");
  
      if (!movie) {
        return res.status(404).send({ message: "Movie not found" });
      }
  
      res.status(200).json(movie);
    } catch (err: any) {
      console.error("Error retrieving movie:", err.message);
      res.status(500).send({ message: "Error retrieving movie" });
    }
  };

  
  