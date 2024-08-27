import { Request, Response } from "express";
import { Review } from "../../models/Review";
import { Movie } from "../../models/Movie";
import { User } from "../../models/userModel";


interface CustomRequest extends Request {
  user?: {
      _id: string;
  }
}

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    if (!reviews.length) {
      // console.log('No reviews found');
      return res.status(404).send({ message: 'No reviews found' });
    }

    // Fetch user data from the User database
    const userIds = reviews.map((review) => review.userId.toString());

    let users: any = {};
    if (userIds.length > 0) {
      const userResponses = await User.find({ _id: { $in: userIds } });
      users = userResponses.reduce((acc, user) => {
        acc[user._id.toString()] = user.toObject();
        return acc;
      }, {});
    }

    // Fetch movie data for each review
    const movieIds = reviews.map((review) => review.movieId);
    const movieResponses = await Promise.all(movieIds.map(async (movieId) => {
      try {
        return await Movie.findById(movieId).select("title poster").exec();
      } catch (err: any) {
        console.error(`Error fetching movie details for ID ${movieId}:`, err.response ? err.response.data : err.message);
        throw err;
      }
    }));

    const movies = movieResponses.reduce((acc, movie) => {
      if (movie) {  // Ensure movie is not undefined
        acc[movie._id.toString()] = movie.toObject();
      }
      return acc;
    }, {});

    // Attach user and movie data to each review
    const reviewsWithUserAndMovies = reviews.map((review) => ({
      ...review.toObject(),
      user: users[review.userId.toString()] || {},  // Map the correct user
      movie: movies[review.movieId.toString()] || {}  // Map the correct movie
    }));

    res.status(200).json(reviewsWithUserAndMovies);
  } catch (err: any) {
    console.error('Error retrieving reviews:', err.message);
    res.status(500).send({ message: 'Error retrieving reviews', error: err.message });
  }
};


export const getReviewById = async (reviewId: any) => {
    try {
        const review = await Review.findById(reviewId).exec();
        
        if (!review) {
            throw new Error("Review not found");
        }
      
        return review;
    } catch (error: any) {
        console.log("Error in getReviewById: ", error.message);
        throw new Error(error.message);
    }
};



export const getReviewByMovie = async (req: Request, res: Response) => {
    try {
      const { movieId } = req.params;
  
      // Fetch reviews from the Review database
      const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
  
      if (reviews.length === 0) {
        return res.status(200).json({ message: 'No reviews found for this movie' });
      }
  
      // Fetch user data from the User database
      const userIds = reviews.map((review: any )=> review.userId.toString()); // Ensure userId is a string
  
      // Fetch user details if there are user IDs
      let users: any = {};
      if (userIds.length > 0) {
        const userResponses = await User.find({ _id: { $in: userIds } });
        users = userResponses.reduce((acc: any, user: any) => {
          acc[user._id.toString()] = user;
          return acc;
        }, {});
      }
  
      // Attach user data to each review
      const reviewsWithUsers = reviews.map((review: any) => ({
        ...review.toObject(),
        user: users[review.userId.toString()] || {},
        rating: review.rating ?? 0, // Default rating to 0 if null or undefined
      }));
  
      // Calculate average rating
      const totalRating = reviews.reduce((sum: any, review: any) => sum + (review.rating ?? 0), 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  
      res.status(200).json({ reviews: reviewsWithUsers, averageRating });
    } catch (err: any) {
      console.error('Error retrieving reviews:', err.message);
      res.status(500).json({ message: 'Error retrieving reviews' });
    }
  };

  


  export const getReviewsByUser = async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
  
      // Fetch user details by username
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found');
        return res.status(404).send({ message: 'User not found' });
      }
  
      const userId = user._id;
  
      // Fetch reviews by userId
      const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
      if (!reviews.length) {
        console.log('No reviews found for this user');
        return res.status(404).send({ message: 'No reviews found for this user' });
      }
  
      // Fetch movie data for each review
      const movieIds = reviews.map((review) => review.movieId);
      const movieResponses = await Promise.all(movieIds.map(async (movieId) => {
        try {
          return await Movie.findById(movieId).select("title poster");
        } catch (err: any) {
          console.error(`Error fetching movie details for ID ${movieId}:`, err.response ? err.response.data : err.message);
          throw err;
        }
      }));
  
      const movies = movieResponses.reduce((acc, movie) => {
        if (movie) {  // Ensure movie is not undefined
          acc[movie._id.toString()] = movie.toObject();
        }
        return acc;
      }, {});
  
      // Attach user and movie data to each review
      const reviewsWithUserAndMovies = reviews.map((review) => ({
        ...review.toObject(),
        user: user.toObject(),  // Convert user document to plain object
        movie: movies[review.movieId.toString()] || {}
      }));
  
      res.status(200).json(reviewsWithUserAndMovies);
    } catch (err: any) {
      console.error('Error retrieving user reviews:', err.message);
      res.status(500).send({ message: 'Error retrieving reviews', error: err.message });
    }
};
  


export const getFollowingUsersReview = async (req: CustomRequest, res: Response) => {
  try {
      const userId = req.user?._id;

      if (!userId) {
          return res.status(400).json({ error: "User ID not found" });
      }

      const userData = await User.findById(userId).select('following').exec();

      if (!userData || !userData.following) {
          return res.status(400).json({ error: "User data or following list not found" });
      }

      // Extract the IDs of users that the authenticated user follows
      const followingUserIds = userData.following.map((id: any) => id.toString());

      // console.log('Following User IDs:', followingUserIds); // Debugging

      if (followingUserIds.length === 0) {
          return res.status(404).json({ error: "No following users found" });
      }

      // Fetch reviews written by the followed users
      const reviews = await Review.find({ userId: { $in: followingUserIds } }).sort({ createdAt: -1 }).exec();

      // console.log('Reviews:', reviews); // Debugging

      if (reviews.length === 0) {
          return res.status(404).json({ error: "No reviews found for following users" });
      }

      // Fetch details for each review
      const reviewsWithDetails = await Promise.all(
          reviews.map(async (review: any) => {
              try {
                  const [movieDetails, userDetails] = await Promise.all([
                      Movie.findById(review.movieId.toString()), // Ensure movieId is a string
                      User.findById(review.userId.toString()) // Ensure userId is a string
                  ]);

                  return {
                      review: review.toObject(),
                      movie: movieDetails,
                      user: userDetails,
                  };
              } catch (detailError: any) {
                  console.error(`Error fetching details for reviewId ${review._id}: ${detailError.message}`);
                  return {
                      review: review.toObject(),
                      movie: null,
                      user: null,
                  };
              }
          })
      );

      // Return the combined data
      res.status(200).json(reviewsWithDetails);
  } catch (error: any) {
      console.error(`Error in getFollowingUsersReview: ${error.message}`);
      res.status(500).json({ error: `Error in getFollowingUsersReview: ${error.message}` });
  }
};

  