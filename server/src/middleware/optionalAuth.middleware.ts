import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
    } else {
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      (req as any).user = decoded;

      next();
    }
  } catch (err) {
    next();
  }
};
