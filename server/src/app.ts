import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from 'cookie-parser';

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

app.get("/api/health-check", (req, res) => {
  res.json({
    message: "Server is running!",
  });
});

export default app;
