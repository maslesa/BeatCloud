import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";

export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).userId;
    const trackID = req.params.trackID as string;

    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const track = await prisma.track.findUnique({
      where: { id: trackID },
    });

    if (!track) return res.status(401).json({ message: "Track not found." });

    if (track.authorId !== userId)
      return res
        .status(403)
        .json({ message: "You are not allowed to delete/change this track." });

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
