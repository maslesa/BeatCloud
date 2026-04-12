import jwt from "jsonwebtoken";

export function createAccessToken(userId: string) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
}
