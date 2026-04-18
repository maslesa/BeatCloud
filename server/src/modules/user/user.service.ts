import { prisma } from "../../config/db";

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      username: true,
      profileImageURL: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if(!user) throw new Error('User not found.');

  return user;

};
