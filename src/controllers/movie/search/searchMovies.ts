import { Movie } from "../../../models/Movie";

export const fetchMovies = async (query: string) => {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    // Perform the search
   return await Movie.find({ title: { $regex: query, $options: "i" },}).exec();
  } catch (error: any) {
    console.error('Error fetching movies:', error);
    throw new Error('Internal server error');
  }
};
