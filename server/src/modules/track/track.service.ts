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
      duration,
      authorId: userId,
    },
  });

  await saveTrackAnalytics(track.id);

  return track;

};
