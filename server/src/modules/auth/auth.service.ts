import { prisma } from "../../config/db";
import * as hash from "../../utils/hash";
import * as crypto from "node:crypto";
import * as token from "../../utils/token";

export const registerUser = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const { email, username, password } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) throw new Error("User already exists.");

  const hashedPassword = await hash.hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) throw new Error("Invalid credentials.");

  const isPasswordCorrect = await hash.checkPassword(password, user.password);

  if (!isPasswordCorrect) throw new Error("Invalid credentials.");

  // check if email is verified!!!
  // ...

  const accessToken = token.createAccessToken(user.id);

  const refreshToken = crypto.randomBytes(64).toString("hex");
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
};
