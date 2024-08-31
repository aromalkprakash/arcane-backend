import { Request, Response } from "express";
import { Movie } from "../../models/Movie";

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