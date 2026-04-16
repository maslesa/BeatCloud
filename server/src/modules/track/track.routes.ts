import { Router } from "express";
import * as trackController from "./track.controller";
import { upload } from "../../middleware/upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/upload",
  authMiddleware,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  trackController.uploadTrack,
);

export default router;
