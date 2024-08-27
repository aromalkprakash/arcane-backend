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
