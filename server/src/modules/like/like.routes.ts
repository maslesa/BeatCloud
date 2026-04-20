import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as likeController from "./like.controller";

const router = Router();

router.post("/:trackID", authMiddleware, likeController.toggleLike);

export default router;
