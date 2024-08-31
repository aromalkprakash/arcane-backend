import express from 'express';
import { getReviewByMovie } from "../controllers/review/getreviewbyMovie";
import { getReviewsByUser } from "../controllers/review/getReviewbyUser";
import { getFollowingUsersReview } from "../controllers/review/reviewOfFollowing/getFollowingUsersReview";
import { getReviewById } from "../controllers/review/getReviewById";
import { addReview } from "../controllers/review/addreview";
import { likeReview } from "../controllers/review/likeReview";
import { deleteReview } from "../controllers/review/deleteReview";
import { protectRoute } from "../middleware/protectRoute";
import { getAllReviews } from "../controllers/review/getAllReview";


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
