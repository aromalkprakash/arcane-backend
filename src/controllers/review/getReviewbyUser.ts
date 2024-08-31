import { Request, Response } from 'express';
import { Review } from "../../models/Review";
import { User } from "../../models/userModel";
import { Movie } from "../../models/Movie";

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
