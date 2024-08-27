// import { Request, Response } from 'express';
// import { User } from '../../models/userModel';
// import mongoose from 'mongoose';

// interface CustomRequest extends Request {
//     user?: { _id: mongoose.Types.ObjectId }; // Adjust type as needed
// }

// export const getUsersForSidebar = async (req: CustomRequest, res: Response) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(400).json({ error: "User ID is missing" });
//         }

//         const loggedInUserId = req.user._id;

//         // Ensure that loggedInUserId is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(loggedInUserId)) {
//             return res.status(400).json({ error: "Invalid User ID" });
//         }

//         // Find the logged-in user and get their following list
//       const loggedInUser = await User.findById(loggedInUserId).select("following");
      
//       console.log(loggedInUser)

//         if (!loggedInUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         if (loggedInUser.following.length === 0) {
//             return res.status(200).json({ users: [] });
//         }

//         // Fetch details of users that the logged-in user is following
//         const followingUsers = await User.findById({
//             _id: { $in: loggedInUser.following }
//         }).select('username profilePicture'); // Adjust fields as needed

//         res.status(200).json({ users: followingUsers });
//     } catch (error: any) {
//         console.error(error.message, "error in getUsersForSidebar");
//         res.status(500).json({ error: "Internal server issue" });
//     }
// };
