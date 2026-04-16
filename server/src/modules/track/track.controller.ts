import { Request, Response } from "express";
import * as trackService from "./track.service";

export const uploadTrack = async (req: Request, res: Response) => {
  try {
    const result = await trackService.uploadTrack(req);

    res.status(201).json({
      message: "Track uploaded successfully",
      track: result,
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
