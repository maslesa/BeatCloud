import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as commentController from "./comment.controller";
import { interactionLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/:trackId", interactionLimiter, authMiddleware, commentController.createComment);
router.get("/get/:trackId", interactionLimiter, commentController.getTrackComments);

export default router;
