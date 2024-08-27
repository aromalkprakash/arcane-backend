import { Request, Response } from 'express';
import { fetchUsers } from './getUsers'; // Adjust import path to match your project structure
import { fetchMovies } from "../../movie/search/searchMovies";

export const searchAll = async (req: Request, res: Response): Promise<Response> => {
  const query = req.query.query as string;
  console.log("qqqqqqqqqqq",query)
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    // Use Promise.all to run fetchUsers and axios.get in parallel
    const [users, movies] = await Promise.all([
      fetchUsers(query), // Call fetchUsers directly with query
      fetchMovies(query)
    ]);

    // Respond with the combined data
    return res.json({
      users,
      movies
    });

  } catch (error: any) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
