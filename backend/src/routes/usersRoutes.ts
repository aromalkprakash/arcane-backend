import express from "express";
import { protectRoute } from "../middleware/protectRoute";

import { searchAll } from "../controllers/user/search/getAllMoviesAndUsers";

import { getFavoriteMovieDetails, getWatchlistDetails } from "../controllers/user/movie/watchListMovie";

import { updateProfile } from "../controllers/user/updateProfile";
import { follow, unFollow } from "../controllers/user/follow-unfollow/follow_unfollow";
import { updateLikedReview } from "../controllers/user/likeReview/likeReview";
import { removeLikedReview } from "../controllers/user/likeReview/removeLikeReview";
import { updateWatchList } from "../controllers/user/watchList";
import { updateFavorite } from "../controllers/user/favorite";
import { getAllUsers, getMReview, getUserByUsername, getUserDetails } from "../controllers/get";
import { getCounts, getFollowersDetails, getFollowingDetails, getLikedReviewDetails, getWatchlist } from "../controllers/user/profileCount/count";

// import { getUsersForSidebar } from "../controllers/messageService/getFollowingUsers";

const router = express.Router();

router.get("/getallusers", getAllUsers);
router.get("/getuserdetails/:username", getUserByUsername); //pp
router.get("/:userId", getMReview);
router.get("/byid/:userId", getUserDetails);
router.get("/search/all", searchAll);
router.get("/counts/:username", getCounts);
router.get("/watchlistdetails/:username", getWatchlist);
router.get("/getfollowingdetails/:username", getFollowingDetails);
router.get("/getfollowersdetails/:username", getFollowersDetails);
router.get("/getwatchlistdetails/:username", getWatchlistDetails);
router.get("/getfavoritemoviedetails/:username", getFavoriteMovieDetails);
router.get("/getlikedreviewdetails/:username", getLikedReviewDetails);


router.post("/updateprofile/", protectRoute, updateProfile);
router.post("/follow/:id", protectRoute, follow);
router.post("/unfollow/:id", protectRoute, unFollow);
router.post("/updatelikedreviews", updateLikedReview);
router.post("/removelikedreviews/:reviewId", removeLikedReview);
router.post("/watchlist", protectRoute, updateWatchList);
router.post("/favorite", protectRoute, updateFavorite);


export default router;
