import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
  keyGenerator: (req) => {
    return (req as any).userId || (req as any).user.userId || req.ip;
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
  keyGenerator: (req) => {
    return (req as any).userId || (req as any).user.userId || req.ip;
  },
});

export const uploadTrackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: "You can upload only 1 track per minute.",
  keyGenerator: (req) => {
    return (req as any).userId || (req as any).user.userId || req.ip;
  },
});

export const interactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => {
    return (req as any).userId || (req as any).user.userId || req.ip;
  },
});
