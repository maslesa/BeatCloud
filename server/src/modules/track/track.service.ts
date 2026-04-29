import cloudinary from "../../utils/cloudinary";
import { prisma } from "../../config/db";
import streamifier from "streamifier";
import { getAudioDuration } from "../../utils/audio";
import { TrackAnalytics } from "../../models/TrackAnalitycs";
import { generateWaveform } from "../../utils/waveform";
import redis from "../../config/redis";
import { logger } from "../../config/logger";

async function invalidateTrackCache() {
  const keys = await redis.keys("tracks:page:*");
  const userKeys = await redis.keys("userTracks:*");
  const searchKeys = await redis.keys("search:*");

  const allKeys = [...keys, ...userKeys, ...searchKeys];

  if (allKeys.length > 0) {
    await redis.del(...allKeys);
  }
}

const uploadToCloudinary = (
  buffer: Buffer,
  resource_type: "image" | "video" | "raw",
) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const saveTrackAnalytics = async (trackId: string, waveform: number[]) => {
  await TrackAnalytics.create({
    trackId,
    waveform,
  });
};

const deleteTrackAnalytics = async (trackId: string) => {
  await TrackAnalytics.deleteOne({
    trackId,
  });
};

export const uploadTrack = async (req: any) => {
  const { title, description, isDownloadable, trackType, bpm, key } = req.body;
  const userId = (req as any).userId;

  const audioFile = req.files?.audio?.[0];
  const coverFile = req.files?.cover?.[0];

  if (!audioFile || !coverFile || !title || !trackType)
    throw new Error("Audio file, track title and track type are required.");

  let parsedBPM: number | undefined = undefined;
  if (bpm) {
    parsedBPM = parseInt(bpm);
    if (isNaN(parsedBPM)) throw new Error("BPM must be number.");
  }

  if (parsedBPM && (parsedBPM < 40 || parsedBPM > 250)) {
    throw new Error("BPM must be between 40 and 250.");
  }

  const audioUpload = await uploadToCloudinary(audioFile.buffer, "video");
  const coverUpload = await uploadToCloudinary(coverFile.buffer, "image");

  const duration = await getAudioDuration(audioFile.buffer);

  const waveform = await generateWaveform(audioFile.buffer);

  const track = await prisma.track.create({
    data: {
      title,
      description,
      isDownloadable: isDownloadable === "true",
      trackType: trackType.toUpperCase(),
      bpm: parsedBPM,
      key: key || undefined,
      audioURL: audioUpload.secure_url,
      coverURL: coverUpload.secure_url,
      audioPublicID: audioUpload.public_id,
      coverPublicID: coverUpload.public_id,
      duration,
      authorId: userId,
    },
  });

  await saveTrackAnalytics(track.id, waveform as number[]);

  await invalidateTrackCache();

  return track;
};

export const getAllTracks = async (
  userID?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const cacheKey = `tracks:page:${page}:limit:${limit}:user:${userID || "guest"}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const skip = (page - 1) * limit;

  const tracks = await prisma.track.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  if (tracks.length === 0) {
    return {
      tracks: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  const trackIds = tracks.map((t) => t.id);

  const analytics = await TrackAnalytics.find({
    trackId: { $in: trackIds },
  });

  const analyticsMap = new Map(analytics.map((a) => [a.trackId, a]));

  let userLikes: any[] = [];

  if (userID) {
    userLikes = await prisma.like.findMany({
      where: {
        userID: userID,
        trackID: { in: trackIds },
      },
    });
  }

  const likedSet = new Set(userLikes.map((l) => l.trackID));

  const mergedTracks = tracks.map((track) => ({
    ...track,
    waveform: analyticsMap.get(track.id)?.waveform || [],
    likes: analyticsMap.get(track.id)?.likes || 0,
    plays: analyticsMap.get(track.id)?.plays || 0,
    comments: analyticsMap.get(track.id)?.comments || 0,
    isLiked: likedSet.has(track.id),
  }));

  const total = await prisma.track.count();

  const result = {
    tracks: mergedTracks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

  return result;
};

export const getSingleTrack = async (trackID: string, userID?: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
    include: {
      author: true,
      likes: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImageURL: true,
            },
          },
        },
      },
    },
  });

  if (!track) throw new Error("Track not found.");

  const analytics = await TrackAnalytics.findOne({
    trackId: trackID,
  });

  let isLiked = false;

  if (userID) {
    const like = await prisma.like.findUnique({
      where: {
        userID_trackID: {
          userID,
          trackID,
        },
      },
    });

    isLiked = !!like;
  }

  return {
    ...track,
    waveform: analytics?.waveform || [],
    likesCount: track.likes.length,
    comments: analytics?.comments,
    likedBy: track.likes.map((l) => l.user),
    isLiked,
    plays: analytics?.plays || 0,
  };
};

export const getUsersTracks = async (
  username: string,
  userID?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const cacheKey = `userTracks:${username}:page:${page}:limit:${limit}:user:${userID || "guest"}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  const skip = (page - 1) * limit;

  const tracks = await prisma.track.findMany({
    where: { authorId: user.id },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  if (tracks.length === 0) {
    const empty = {
      tracks: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
    await redis.set(cacheKey, JSON.stringify(empty), "EX", 60);
    return empty;
  }

  const trackIds = tracks.map((t) => t.id);

  const analytics = await TrackAnalytics.find({
    trackId: { $in: trackIds },
  });

  const analyticsMap = new Map(analytics.map((a) => [a.trackId, a]));

  let userLikes: any[] = [];

  if (userID) {
    userLikes = await prisma.like.findMany({
      where: {
        userID: userID,
        trackID: { in: trackIds },
      },
    });
  }

  const likedSet = new Set(userLikes.map((l) => l.trackID));

  const mergedTracks = tracks.map((track) => ({
    ...track,
    waveform: analyticsMap.get(track.id)?.waveform || [],
    likes: analyticsMap.get(track.id)?.likes || 0,
    plays: analyticsMap.get(track.id)?.plays || 0,
    comments: analyticsMap.get(track.id)?.comments || 0,
    isLiked: likedSet.has(track.id),
  }));

  const total = await prisma.track.count({
    where: { authorId: user.id },
  });

  const result = {
    tracks: mergedTracks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

  return result;
};

export const deleteTrack = async (trackID: string) => {
  const deletedTrack = await prisma.$transaction(async (prisma) => {
    const track = await prisma.track.findUnique({
      where: { id: trackID },
    });

    if (!track) throw new Error("Track not found.");

    try {
      await cloudinary.uploader.destroy(track.audioPublicID, {
        resource_type: "video",
      });
    } catch (error) {
      logger.error("Failed to delete audio.");
    }

    try {
      await cloudinary.uploader.destroy(track.coverPublicID, {
        resource_type: "image",
      });
    } catch (error) {
      logger.error("Failed to delete cover.");
    }

    return prisma.track.delete({
      where: { id: trackID },
      include: { author: true },
    });
  });

  await deleteTrackAnalytics(trackID);

  await invalidateTrackCache();

  return deletedTrack;
};

export const updateTrack = async (req: any) => {
  const { title, description, isDownloadable, trackType } = req.body;
  const trackID = (req as any).params.trackID;

  if (!trackID) throw new Error("Track ID is required.");

  const coverFile = req.files?.cover?.[0];

  const updatedTrack = await prisma.$transaction(async (prisma) => {
    const track = await prisma.track.findUnique({
      where: { id: trackID },
    });

    if (!track) throw new Error("Track not found.");

    let coverUpload = null;

    if (coverFile) {
      try {
        await cloudinary.uploader.destroy(track.coverPublicID, {
          resource_type: "image",
        });
      } catch (error) {
        logger.error("Failed to delete old cover.");
      }

      coverUpload = await uploadToCloudinary(coverFile.buffer, "image");
    }

    return prisma.track.update({
      where: { id: trackID },
      data: {
        title: title ?? track.title,
        description: description ?? track.description,
        isDownloadable:
          isDownloadable !== undefined
            ? isDownloadable === "true"
            : track.isDownloadable,
        trackType: trackType ?? track.trackType,
        coverURL: coverFile ? coverUpload.secure_url : track.coverURL,
        coverPublicID: coverFile ? coverUpload.public_id : track.coverPublicID,
      },
    });
  });

  await invalidateTrackCache();

  return updatedTrack;
};

export const downloadTrack = async (trackID: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
  });

  if (!track) throw new Error("Track not found.");

  if (!track.isDownloadable)
    throw new Error("This track is not available for download.");

  return track;
};

export const incrementTrackPlays = async (trackID: string, userID: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
    select: { authorId: true },
  });

  if (!track) throw new Error("Track not found");

  if (userID !== track.authorId) {
    await TrackAnalytics.findOneAndUpdate(
      { trackId: trackID },
      { $inc: { plays: 1 } },
      { new: true, upsert: true },
    );
  }

  return track;
};

export const searchTracks = async (
  filters: any,
  userID?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const { q, trackType, key, bpm, isDownloadable } = filters;

  const cacheKey = `search:${JSON.stringify(filters)}:page:${page}:limit:${limit}:user:${userID || "guest"}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const where: any = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { author: { username: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {},
      trackType ? { trackType } : {},
      key ? { key } : {},
      bpm ? { bpm: parseInt(bpm) } : {},
      isDownloadable !== undefined
        ? { isDownloadable: isDownloadable === "true" }
        : {},
    ],
  };

  const skip = (page - 1) * limit;

  const tracks = await prisma.track.findMany({
    where,
    skip,
    take: limit,
    include: {
      author: {
        select: { username: true, profileImageURL: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (tracks.length === 0) {
    const empty = {
      tracks: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
    await redis.set(cacheKey, JSON.stringify(empty), "EX", 60);
    return empty;
  }

  const trackIds = tracks.map((t) => t.id);

  const analytics = await TrackAnalytics.find({
    trackId: { $in: trackIds },
  });

  const analyticsMap = new Map(analytics.map((a) => [a.trackId, a]));

  let userLikes: any[] = [];
  if (userID) {
    userLikes = await prisma.like.findMany({
      where: {
        userID: userID,
        trackID: { in: trackIds },
      },
    });
  }

  const likedSet = new Set(userLikes.map((l) => l.trackID));

  const mergedTracks = tracks.map((track) => ({
    ...track,
    waveform: analyticsMap.get(track.id)?.waveform || [],
    likes: analyticsMap.get(track.id)?.likes || 0,
    plays: analyticsMap.get(track.id)?.plays || 0,
    comments: analyticsMap.get(track.id)?.comments || 0,
    isLiked: likedSet.has(track.id),
  }));

  const total = await prisma.track.count({ where });

  const result = {
    tracks: mergedTracks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

  return result;
};
