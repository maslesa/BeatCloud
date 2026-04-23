import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as commentController from "./comment.controller";

const router = Router();

router.post("/:trackId", authMiddleware, commentController.createComment);
router.get("/get/:trackId", commentController.getTrackComments);

export default router;
