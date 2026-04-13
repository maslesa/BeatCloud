import { Request, Response } from "express";
import * as authService from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    await authService.verifyEmail(token as string);

    res.send("Email verified successfully!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // should be true in production
      sameSite: true,
    });

    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }
};
