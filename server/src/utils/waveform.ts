import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath as string);

export const generateWaveform = (buffer: Buffer): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(buffer);

    const chunks: Buffer[] = [];

    ffmpeg(inputStream)
      .noVideo()
      .audioChannels(1)
      .audioFrequency(44100)
      .format("s16le")
      .on("start", () => {})
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        try {
          const pcmBuffer = Buffer.concat(chunks);

          const samples: number[] = [];

          for (let i = 0; i < pcmBuffer.length; i += 2) {
            samples.push(pcmBuffer.readInt16LE(i));
          }

          const POINTS = 500;
          const blockSize = Math.floor(samples.length / POINTS);

          const waveform: number[] = [];

          for (let i = 0; i < POINTS; i++) {
            let sum = 0;
            let count = 0;

            for (let j = 0; j < blockSize; j++) {
              const sample = samples[i * blockSize + j];

              if (!isNaN(sample)) {
                sum += Math.abs(sample);
                count++;
              }
            }

            waveform.push(count ? sum / count : 0);
          }

          const max = Math.max(...waveform);

          const normalized = waveform.map((v) => (max === 0 ? 0 : v / max));

          resolve(normalized);
        } catch (err) {
          reject(err);
        }
      })
      .pipe()
      .on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
  });
};
