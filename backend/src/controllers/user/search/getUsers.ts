// getUsers.ts

import { User } from "../../../models/userModel";

export const fetchUsers = async (query: string) => {
  if (!query) {
    throw new Error('Query is required');
  }

  try {
    return await User.find({ fullName: { $regex: query, $options: 'i' } }).exec();
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error('Internal server error');
  }
};
