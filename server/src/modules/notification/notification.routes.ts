import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import * as notificationController from "./notification.controller";

const router = Router();

router.get("/recent", authMiddleware, notificationController.getNotifications);
router.patch("/:notificationId/read", notificationController.markNotificationAsRead);

export default router;
