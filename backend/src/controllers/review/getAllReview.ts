import { Request, Response } from "express";
import { Review } from "../../models/Review";
import { Movie } from "../../models/Movie";
import { User } from "../../models/userModel";

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
