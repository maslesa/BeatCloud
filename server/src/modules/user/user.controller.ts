import { Request, Response } from "express";
import * as userService from "./user.service";

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await userService.getUserByUsername(username as string);

    res.status(200).json({
      message: "User fetched successfully.",
      user,
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
