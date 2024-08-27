import { Request, Response } from "express";
import { User } from "../../../models/userModel";

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
