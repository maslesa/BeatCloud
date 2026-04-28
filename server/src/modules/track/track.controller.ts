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
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    const result = await trackService.getAllTracks(userId, page, limit);

    res.status(200).json({
      message: "All tracks fetched successfully",
      ...result,
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

  if (!trackID)
    return res.status(404).json({ message: "Track ID is required." });

  try {
    const track = await trackService.getSingleTrack(
      trackID as string,
      userId as string,
    );

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

  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;

  if (!username)
    return res.status(404).json({ message: "User ID is required." });

  try {
    const result = await trackService.getUsersTracks(
      username as string,
      userId as string,
      page,
      limit,
    );

    res.status(200).json({
      message: "User's tracks fetched successfully.",
      ...result,
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

export const incrementTrackPlays = async (req: Request, res: Response) => {
  try {
    const { trackId } = req.params;
    const user = (req as any).user;

    const track = await trackService.incrementTrackPlays(
      trackId as string,
      user.userId as string,
    );

    return res.status(200).json({
      message: "Track plays incremented successfully",
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

export const searchTracks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const userId = (req as any).user?.userId;
    const result = await trackService.searchTracks(req.query, userId, page, limit);
    return res.status(200).json({
      message: "Filtered tracks fetched successfully",
      ...result,
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
