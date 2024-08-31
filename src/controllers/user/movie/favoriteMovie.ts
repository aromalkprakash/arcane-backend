import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
import { Movie } from "../../../models/Movie";

export const getFavoriteMovieDetails = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username }).select('favorites').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch detailed data for each favorite movie
        const favoriteMoviePromises = user.favorites.map(async (movieId: any) => {
            const movie = await Movie.findById(movieId.toString()).exec();
            return movie ? movie.toObject() : null; // Convert movie to plain object
        });

        // Await all promises
        const favoriteMovieResponses = await Promise.all(favoriteMoviePromises);

        // Filter out any null responses
        const favoriteMovieDetails = favoriteMovieResponses.filter(movie => movie !== null);

        return res.json({
            favoriteFilms: favoriteMovieDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user details with populated data:', err);
        return res.status(500).json({ message: 'Error fetching favorite movie details' });
    }
};
