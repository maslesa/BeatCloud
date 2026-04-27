import { Request, Response } from "express";
import * as followService from "./follow.service";

export const toggleFollow = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).userId;
    const { followingId } = req.params;

    const isFollowing = await followService.getFollowStatus(
      followerId,
      followingId as string,
    );

    if (isFollowing) {
      await followService.unfollowUser(followerId, followingId as string);
      return res.status(200).json({
        message: "Unfollowed successfully",
        isFollowing: false,
      });
    } else {
      await followService.followUser(followerId, followingId as string);
      return res.status(200).json({
        message: "Followed successfully",
        isFollowing: true,
      });
    }
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
