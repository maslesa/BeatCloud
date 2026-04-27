import { prisma } from "../../config/db";

export const getUserByUsername = async (
  username: string,
  currentUserId?: string,
) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      username: true,
      profileImageURL: true,
      isVerified: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          tracks: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found.");

  let isFollowing = false;

  if (currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  return {...user, isFollowing};
};
