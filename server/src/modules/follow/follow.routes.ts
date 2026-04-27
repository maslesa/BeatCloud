import { Router } from "express";
import * as followController from "./follow.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/toggle/:followingId", authMiddleware, followController.toggleFollow);

export default router;
