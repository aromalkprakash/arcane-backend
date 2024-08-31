import { User } from "../../../models/userModel";

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