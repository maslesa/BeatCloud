import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as likeController from "./like.controller";
import { interactionLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/:trackID", interactionLimiter, authMiddleware, likeController.toggleLike);

export default router;
