import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health-check", (req, res) => {
  res.json({
    message: "Server is running!",
  });
});

export default app;
