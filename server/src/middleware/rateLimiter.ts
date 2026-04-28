import rateLimit, {ipKeyGenerator} from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

export const uploadTrackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: "You can upload only 1 track per minute.",
});

export const interactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});
