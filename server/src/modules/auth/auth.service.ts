import { prisma } from "../../config/db";
import * as hash from "../../utils/hash";
import * as crypto from "node:crypto";
import * as token from "../../utils/token";
import { sendMail } from "../../utils/email";
import { getGoogleClient } from "../../utils/google";

function getAppURL() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

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

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      verificationToken,
    },
  });

  const verificationURL = `${getAppURL()}/auth/verify-email?token=${verificationToken}`;

  await sendMail(
    user.email,
    "Verify your email",
    `
    <p>Please verify your email.</p>
    <p><a href="${verificationURL}">${verificationURL}</a></p>
  `,
  );

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) throw new Error("Invalid token!");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });
};

export const loginUser = async (data: { email: string; password: string }) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) throw new Error("Invalid credentials.");

  const isPasswordCorrect = await hash.checkPassword(password, user.password);

  if (!isPasswordCorrect) throw new Error("Invalid credentials.");

  if (!user.isVerified) throw new Error("Please verify your email.");

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

export const googleAuthHandler = async (code: string) => {
  const client = getGoogleClient();

  const { tokens } = await client.getToken(code);

  if (!tokens.id_token) throw new Error("No Google ID token.");

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const email = payload?.email;
  const emailVerified = payload?.email_verified;
  const name = payload?.name;
  const picture = payload?.picture;
  const googleID = payload?.sub;

  if (!email || !emailVerified)
    throw new Error("Google email is not verified.");

  let user = await prisma.user.findFirst({
    where: { OR: [{ email }, { googleId: googleID }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        username: `${name}_${Math.floor(Math.random() * 10000)}`,
        googleId: googleID,
        isVerified: true,
        profileImageURL: picture,
      },
    });
  }

  if (user && !user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: googleID,
        isVerified: true,
        profileImageURL: user.profileImageURL || picture,
      },
    });
  }

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
      profileImageURL: user.profileImageURL,
    },
  };
};
