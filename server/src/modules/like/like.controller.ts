import { Request, Response } from "express";
import * as likeService from "./like.service";

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userID = (req as any).userId;
    const { trackID } = req.params;

    const result = await likeService.toggleLike(userID, trackID as string);

    res.status(200).json({
      message: "Track liked successfully.",
      result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};
