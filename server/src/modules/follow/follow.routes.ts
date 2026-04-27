import { Router } from "express";
import * as followController from "./follow.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { interactionLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/toggle/:followingId", interactionLimiter, authMiddleware, followController.toggleFollow);

export default router;
