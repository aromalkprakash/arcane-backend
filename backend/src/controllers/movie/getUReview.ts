import { Request, Response } from "express";
import { Movie } from "../../models/Movie";

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
