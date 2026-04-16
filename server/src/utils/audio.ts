import { parseBuffer } from "music-metadata";

export const getAudioDuration = async (buffer: Buffer) => {
  const metadata = await parseBuffer(buffer, "audio/wav");
  return metadata.format.duration;
};
