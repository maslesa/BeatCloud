import { Request, Response } from "express";
import * as authService from "./auth.service";
import { getGoogleClient } from "../../utils/google";
import { prisma } from "../../config/db";
import * as token from "../../utils/token";

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
      res.status(500).json({
        message: "Internal server error.",
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
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
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
      res.status(500).json({
        message: "Internal server error.",
      });
    }
  }
};

export const googleAuthStartHandler = async (_req: Request, res: Response) => {
  try {
    const client = getGoogleClient();
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.redirect(url);
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

export const googleAuthCallbackHandler = async (
  req: Request,
  res: Response,
) => {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({
      message: "Missing Google code in callback.",
    });
  }

  try {
    const result = await authService.googleAuthHandler(code);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/home`);
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

export const me = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "You are not logged in." });

    const session = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!session) return res.status(401).json({ message: "Invalid session." });

    const accessToken = token.createAccessToken(session.user.id);

    return res.json({
      user: session.user,
      accessToken,
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

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    await authService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully.",
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
