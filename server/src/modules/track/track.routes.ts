import { Router } from "express";
import * as trackController from "./track.controller";
import { upload } from "../../middleware/upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorizedMiddleware } from "../../middleware/authorized.middleware";
import { optionalAuthMiddleware } from "../../middleware/optionalAuth.middleware";

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
router.get("/all", optionalAuthMiddleware, trackController.getAllTracks);
router.get("/:trackID", optionalAuthMiddleware, trackController.getSingleTrack);
router.get("/user/:username", optionalAuthMiddleware, trackController.getUsersTracks);
router.delete(
  "/:trackID",
  authMiddleware,
  authorizedMiddleware,
  trackController.deleteTrack,
);
router.put(
  "/:trackID",
  authMiddleware,
  authorizedMiddleware,
  upload.fields([{ name: "cover", maxCount: 1 }]),
  trackController.updateTrack,
);
router.get("/download/:trackID", trackController.downloadTrack);

export default router;
