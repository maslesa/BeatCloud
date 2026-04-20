import { Request, Response } from "express";
import * as trackService from "./track.service";
import axios from "axios";

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

export const getAllTracks = async (req: Request, res: Response) => {
  try {

    const userId = (req as any).user?.userId;

    const result = await trackService.getAllTracks(userId);

    res.status(200).json({
      message: "All tracks fetched successfully",
      tracks: result,
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

export const getSingleTrack = async (req: Request, res: Response) => {
  const trackID = req.params.trackID;
  const userId = (req as any).user?.userId;

  if (!trackID) res.status(404).json({ message: "Track ID is required." });

  try {
    const track = await trackService.getSingleTrack(trackID as string, userId as string);

    res.status(200).json({
      message: "Track fetched successfully",
      track,
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

export const getUsersTracks = async (req: Request, res: Response) => {
  const username = req.params.username;
  const userId = (req as any).user?.userId;

  if (!username) res.status(404).json({ message: "User ID is required." });

  try {
    const usersTracks = await trackService.getUsersTracks(username as string, userId as string);

    res.status(200).json({
      message: "User's tracks fetched successfully.",
      tracks: usersTracks,
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

export const deleteTrack = async (req: Request, res: Response) => {
  const trackID = req.params.trackID;

  if (!trackID) throw new Error("Track ID is required.");

  try {
    const deletedTrack = await trackService.deleteTrack(trackID as string);

    res.status(200).json({
      message: "Track deleted successfully",
      tracK: deletedTrack,
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

export const updateTrack = async (req: Request, res: Response) => {
  try {
    const result = await trackService.updateTrack(req);

    res.status(200).json({
      message: "Track updated successfully",
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

export const downloadTrack = async (req: Request, res: Response) => {
  try {
    const { trackID } = req.params;

    const track = await trackService.downloadTrack(trackID as string);

    const response = await axios.get(track.audioURL, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${track.title}.wav"`,
    );
    res.setHeader("Content-Type", "audio/wav");

    response.data.pipe(res);
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
