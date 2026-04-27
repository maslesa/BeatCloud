import { prisma } from "../../config/db";
import { io } from "../../server";

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId)
    throw new Error("You can not follow yourself.");

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  const notification = await prisma.notification.create({
    data: {
      type: "FOLLOW",
      message: "started following you.",
      userID: followingId,
      senderID: followerId,
      isRead: false,
    },
    include: {
      sender: { select: { username: true, profileImageURL: true } },
    },
  });

  io.to(followingId).emit("notification", notification);

  return follow;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  return await prisma.follow.delete({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });
};

export const getFollowStatus = async (
  followerId: string,
  followingId: string,
) => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  return !!follow;
};
