import { Router } from "express";
import * as userController from "./user.controller";
import { optionalAuthMiddleware } from "../../middleware/optionalAuth.middleware";

const router = Router();

router.get("/:username", optionalAuthMiddleware, userController.getUserByUsername);

export default router;
