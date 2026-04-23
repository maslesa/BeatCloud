import { prisma } from "../../config/db";
import { TrackAnalytics } from "../../models/TrackAnalitycs";
import { io } from "../../server";

export const toggleLike = async (userID: string, trackID: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
    include: { author: true },
  });

  if (!track) throw new Error("Track not found");

  const existingLike = await prisma.like.findUnique({
    where: {
      userID_trackID: {
        userID,
        trackID,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });

    await TrackAnalytics.findOneAndUpdate(
      { trackId: trackID },
      { $inc: { likes: -1 } },
      { new: true, upsert: true },
    );

    await prisma.notification.deleteMany({
      where: {
        userID: track.authorId,
        senderID: userID,
        trackID: trackID,
        type: "LIKE",
      },
    });

    return { liked: false };
  }

  await prisma.like.create({
    data: {
      userID,
      trackID,
    },
  });

  await TrackAnalytics.findOneAndUpdate(
    { trackId: trackID },
    { $inc: { likes: 1 } },
    { new: true, upsert: true },
  );

  if (track.authorId !== userID) {
    const notification = await prisma.notification.create({
      data: {
        type: "LIKE",
        message: `liked your track "${track.title}"`,
        userID: track.authorId,
        senderID: userID,
        trackID: trackID,
        isRead: false,
      },
      include: {
        sender: { select: { username: true, profileImageURL: true } },
        track: { select: { coverURL: true } },
      },
    });

    io.to(track.authorId).emit("notification", notification);
  }

  return { liked: true };
};
