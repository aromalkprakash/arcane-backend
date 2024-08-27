import { Request, Response } from 'express';
import { User } from "../../../models/userModel";
import { Movie } from "../../../models/Movie";
import { getReviewById } from "../../review/getReviewById";


export const getCounts = async (req: Request, res: Response) => {
    const { username } = req.params;
  
    try {
      // Find user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Get the user's counts with default values for missing fields
      const userCounts = await User.aggregate([
        { $match: { _id: user._id } },
        {
          $project: {
            _id: 0,
            watchListCount: { $size: { $ifNull: ["$watchList", []] } },   //$ifNull if it missing///
            favoritesCount: { $size: { $ifNull: ["$favorites", []] } },
            likedReviewsCount: { $size: { $ifNull: ["$likedReviews", []] } },
            followingCount: { $size: { $ifNull: ["$following", []] } },
            followersCount: { $size: { $ifNull: ["$followers", []] } },
          },
        },
      ]);
  
      return res.json(
        userCounts[0] || {
          watchListCount: 0,
          favoritesCount: 0,
          likedReviewsCount: 0,
          followingCount: 0,
          followersCount: 0,
        }
      );
    } catch (err: any) {
      console.error("Error fetching user counts:", err);
      return res.status(500).json({ message: "Error retrieving user counts" });
    }
  };

  

export const getFollowersDetails = async (req: Request, res: Response) => {
    const { username } = req.params;
    

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('followers')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followersPromises = user.followers.map(async (followerId: any) =>
            getUserDetails(followerId).catch(err => {
                console.error(`Error fetching details for follower ID ${followerId}:`, err);
                return null;
            })
        );

        const followersResponse = await Promise.all(followersPromises);

        const followersDetails = followersResponse.filter(res => res);

        return res.json({ followers: followersDetails });
    } catch (err: any) {
        console.error('Error fetching followers details:', err);
        return res.status(500).json({ message: 'Error fetching followers details' });
    }
};

export const getUserDetails = async (userId: string) => {
    try {
      const user = await User.findById(userId)
        .select('fullName username image username')
        .exec();
  
      if (!user) {
        return null;
      }
  
      return {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        image: user.image,
      };
    } catch (err: any) {
      console.error(`Error fetching user details for ID ${userId}:`, err);
      return null;
    }
};
  


export const getFollowingDetails = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('following')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingPromises = user.following.map(async (followingId: any) =>
            getUserDetails(followingId).catch(err => {
                console.error(`Error fetching details for following ID ${followingId}:`, err);
                return null;
            })
        );


        // Await all promises
        const [followingResponse] = await Promise.all([
            Promise.all(followingPromises),

        ]);

        // Process and filter out any null responses

        const followingDetails = followingResponse.filter(res => res).map(res => res);

        return res.json({
            following: followingDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user following data:', err);
        return res.status(500).json({ message: 'Error fetching following details' });
    }
};



export const getLikedReviewDetails = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        // Fetch user with basic details
        const user = await User.findOne({ username })
            .select('likedReviews')
            .exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure likedReviews is an array
        const likedReviews = user.likedReviews || [];

        // Fetch detailed data from other services
        const likedReviewPromises = likedReviews.map(async (reviewId: any) => {
            try {
                const review = await getReviewById(reviewId.toString());

                const [movieResponse, userDetails] = await Promise.all([
                    await Movie.findById(review.movieId.toString()),
                    getUserDetails(review.userId.toString())
                ]);

                if (!movieResponse || !userDetails) {
                    throw new Error("Failed to fetch movie or user details");
                }

                return {
                    review,
                    movie: movieResponse,
                    user: userDetails,
                };
            } catch (err) {
                console.error(`Error fetching details for review ID ${reviewId}:`, err);
                return null;
            }
        });

        // Await all promises
        const likedReviewDetails = await Promise.all(likedReviewPromises);

        // Filter out null responses
        const validLikedReviewDetails = likedReviewDetails.filter(detail => detail !== null);

        return res.json({
            likedReviews: validLikedReviewDetails,
        });
    } catch (err: any) {
        console.error('Error fetching user liked review data:', err);
        return res.status(500).json({ message: 'Error fetching liked review details' });
    }
};



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
