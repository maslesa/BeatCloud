import mongoose from "mongoose";

const TrackAnalyticsSchema = new mongoose.Schema({
  trackId: String,
  waveform: [Number],
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
});

export const TrackAnalytics = mongoose.model(
  "TrackAnalytics",
  TrackAnalyticsSchema,
);
