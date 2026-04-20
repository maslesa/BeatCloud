import cloudinary from "../../utils/cloudinary";
import { prisma } from "../../config/db";
import streamifier from "streamifier";
import { getAudioDuration } from "../../utils/audio";
import { TrackAnalytics } from "../../models/TrackAnalitycs";
import { generateWaveform } from "../../utils/waveform";

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

  return track;
};

export const getAllTracks = async (userID?: string) => {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  if (!tracks) throw new Error("There is no uploaded tracks yet.");

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
    isLiked: likedSet.has(track.id),
  }));

  return mergedTracks;
};

export const getSingleTrack = async (trackID: string, userID?: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
    include: {
      author: true,
      likes: {
        take: 10,
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

  let isLiked = false;

  if (userID) {
    const like = await prisma.like.findUnique({
      where: {
        userID_trackID: {
          userID: userID,
          trackID: trackID,
        },
      },
    });

    isLiked = !!like;
  }

  return {
    ...track,
    likedBy: track.likes.map((l) => l.user),
    isLiked,
  };
};

export const getUsersTracks = async (username: string, userID?: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      tracks: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) throw new Error("User not found.");

  const trackIds = user.tracks.map((t) => t.id);

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

  return user.tracks.map((track) => ({
    ...track,
    waveform: analyticsMap.get(track.id)?.waveform || [],
    likes: analyticsMap.get(track.id)?.likes || 0,
    plays: analyticsMap.get(track.id)?.plays || 0,
    isLiked: likedSet.has(track.id),
  }));
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
      console.log("Failed to delete audio.");
    }

    try {
      await cloudinary.uploader.destroy(track.coverPublicID, {
        resource_type: "image",
      });
    } catch (error) {
      console.log("Failed to delete cover.");
    }

    return prisma.track.delete({
      where: { id: trackID },
      include: { author: true },
    });
  });

  await deleteTrackAnalytics(trackID);

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
        console.log("Failed to delete old cover.");
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
