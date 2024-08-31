import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
import { Movie } from "../../../models/Movie";

export const getWatchlist = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('watchList')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch detailed data from other services
        const watchlistPromises = user.watchList.map(async (movieId: any) => {
            const movieDetails = await Movie.findById(movieId);
            return movieDetails?.data || null;
        });

        // Await all promises
        const watchlistMoviesDetails = (await Promise.all(watchlistPromises)).filter(movie => movie !== null);

        return res.json({
            user,
            watchList: watchlistMoviesDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user details with populated data:', err);
        return res.status(500).json({ message: 'Error fetching user details' });
    }
};
