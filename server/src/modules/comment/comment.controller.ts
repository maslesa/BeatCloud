import { Request, Response } from "express";
import * as commentService from "./comment.service";

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { trackId } = req.params;
    const { content } = req.body;
    const comment = await commentService.createComment(
      userId as string,
      trackId as string,
      content as string,
    );

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
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

export const getTrackComments = async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    const comments = await commentService.getTrackComments(trackId as string);
    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
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
