import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import trackRoutes from "./modules/track/track.routes";
import userRoutes from "./modules/user/user.routes";
import likeRoutes from "./modules/like/like.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import commentRoutes from "./modules/comment/comment.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/user", userRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comment", commentRoutes);

app.get("/api/health-check", (_req, res) => {
  res.json({
    message: "Server is running!",
  });
});

export default app;
