import { v2 as cloudinary } from "cloudinary";
import { Movie } from "../../models/Movie";

interface CreatePostRequest {
  body: {
    title: string;
    poster?: string;
    bannerImg?: string;
    description: string;
    releaseYear?: Date;
    genre?: string[];
    director?: string;
    actors?: string[];
    trailer?: string;
  };
}

export const addMovie = async (req: CreatePostRequest, res: any) => {
  try {
    const { body }: CreatePostRequest = req;
    console.log(body);

    if (!body.title || !body.description) {
      return res
        .status(400)
        .json({ error: "Movie details must have title & description" });
    }

    let posterUrl: string | undefined;
    let bannerUrl: string | undefined;

    if (body.poster) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(body.poster);
        posterUrl = uploadedResponse.secure_url;
      } catch (error: any) {
        console.error("Error uploading poster to Cloudinary:", error);
        return res
          .status(500)
          .json({ error: "Internal server error (Cloudinary upload)" });
      }
    }

    if (body.bannerImg) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(
          body.bannerImg
        );
        bannerUrl = uploadedResponse.secure_url;
      } catch (error: any) {
        console.error("Error uploading banner to Cloudinary:", error);
        return res
          .status(500)
          .json({ error: "Internal server error (Cloudinary upload)" });
      }
    }

    const newMovie = new Movie({
      ...body,
      poster: posterUrl,
      bannerImg: bannerUrl,
    });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
