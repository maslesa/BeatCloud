import { prisma } from "../../config/db";
import { TrackAnalytics } from "../../models/TrackAnalitycs";

export const toggleLike = async (userID: string, trackID: string) => {
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

  return { liked: true };
};
