import express from 'express';

import { addReview } from "../controllers/review/addreview";
import { likeReview } from "../controllers/review/likeReview";
import { deleteReview } from "../controllers/review/deleteReview";
import { protectRoute } from "../middleware/protectRoute";
import { getAllReviews, getFollowingUsersReview, getReviewById, getReviewByMovie, getReviewsByUser } from "../controllers/review/get_review";


const router = express.Router();

router.get("/getallreview", getAllReviews);
router.get("/getmoviereview/:movieId", getReviewByMovie);
router.get("/getuserreview/:username", getReviewsByUser);
router.get("/getfollowingusersreview/", protectRoute, getFollowingUsersReview);
router.get("/:reviewId", getReviewById);


router.post("/addreview", protectRoute, addReview);
router.post("/likereview", likeReview);
router.delete("/delete/:reviewId", deleteReview);

export default router;
