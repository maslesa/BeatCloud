import { prisma } from "../../config/db";
import { io } from "../../server";
import { TrackAnalytics } from "../../models/TrackAnalitycs";

export const createComment = async (
  userId: string,
  trackId: string,
  content: string,
) => {
  const comment = await prisma.comment.create({
    data: {
      content,
      trackID: trackId,
      userID: userId,
    },
    include: {
      user: {
        select: { username: true, profileImageURL: true },
      },
    },
  });

  const track = await prisma.track.findUnique({
    where: { id: trackId },
    include: { author: true },
  });

  if (!track) throw new Error("Track not found.");

  await TrackAnalytics.findOneAndUpdate(
    { trackId: trackId },
    { $inc: { comments: 1 } },
    { new: true, upsert: true },
  );

  if (track.authorId !== userId) {
    const notification = await prisma.notification.create({
      data: {
        type: "COMMENT",
        message: `commented on your track "${track.title}"`,
        userID: track.authorId,
        senderID: userId,
        trackID: trackId,
        isRead: false,
      },
      include: {
        sender: { select: { username: true, profileImageURL: true } },
        track: { select: { coverURL: true } },
      },
    });

    io.to(track.authorId).emit("notification", notification);
  }

  return comment;
};

export const getTrackComments = async (trackId: string) => {
  return await prisma.comment.findMany({
    where: { trackID: trackId },
    include: {
      user: {
        select: { username: true, profileImageURL: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
