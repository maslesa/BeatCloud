import cloudinary from "../../utils/cloudinary";
import { prisma } from "../../config/db";
import streamifier from "streamifier";
import { getAudioDuration } from "../../utils/audio";
import { TrackAnalytics } from "../../models/TrackAnalitycs";

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

const saveTrackAnalytics = async (trackId: string) => {
  await TrackAnalytics.create({
    trackId,
    waveform: [],
  });
};

const deleteTrackAnalytics = async (trackId: string) => {
  await TrackAnalytics.deleteOne({
    trackId,
  });
};

export const uploadTrack = async (req: any) => {
  const { title, description, isDownloadable, trackType } = req.body;
  const userId = (req as any).userId;

  const audioFile = req.files?.audio?.[0];
  const coverFile = req.files?.cover?.[0];

  if (!audioFile || !coverFile || !title || !trackType)
    throw new Error("Audio file, track title and track type are required.");

  const audioUpload = await uploadToCloudinary(audioFile.buffer, "video");
  const coverUpload = await uploadToCloudinary(coverFile.buffer, "image");

  const duration = await getAudioDuration(audioFile.buffer);

  const track = await prisma.track.create({
    data: {
      title,
      description,
      isDownloadable: isDownloadable === "true",
      trackType: trackType.toUpperCase(),
      audioURL: audioUpload.secure_url,
      coverURL: coverUpload.secure_url,
      audioPublicID: audioUpload.public_id,
      coverPublicID: coverUpload.public_id,
      duration,
      authorId: userId,
    },
  });

  await saveTrackAnalytics(track.id);

  return track;
};

export const getAllTracks = async () => {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  if (!tracks) throw new Error("There is no uploaded tracks yet.");

  return tracks;
};

export const getSingleTrack = async (trackID: string) => {
  const track = await prisma.track.findUnique({
    where: { id: trackID },
    include: { author: true },
  });

  if (!track) throw new Error("Track not found.");

  return track;
};

export const getUsersTracks = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      tracks: {
        include: { author: true },
      },
    },
  });

  if (!user) throw new Error("User not found.");

  return user.tracks;
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
