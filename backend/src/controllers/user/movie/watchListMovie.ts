import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
import { getMovieDetails } from "../../movie/getmovieDetails";
import { Movie } from "../../../models/Movie";


export const getWatchlistDetails = async (req: Request, res: Response) => {
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
        const watchListPromises = user.watchList.map(async(movieId: any) =>
           await Movie.findById(movieId.toString())
        );


        // Await all promises
        const [watchListResponse] = await Promise.all([
            Promise.all(watchListPromises),
        ]);

        // Process and filter out any null responses
        const watchListDetails = watchListResponse.filter(res => res && res.data).map(res => res?.data);


        return res.json({
            watchList: watchListDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user details with populated data:', err);
        return res.status(500).json({ message: 'Error fetching watchlist movie details' });
    }
};