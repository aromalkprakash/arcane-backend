import { Request, Response } from "express";
import { Movie } from "../../models/Movie";

export const updateMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const {
    title,
    description,
    genre,
    duration,
    director,
    releaseYear,
    trailer,
    poster,
    bannerImg,
  } = req.body;

  try {
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      {
        title,
        description,
        genre,
        duration,
        director,
        releaseYear,
        trailer,
        poster,
        bannerImg,
      },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
