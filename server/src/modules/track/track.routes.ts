import { Router } from "express";
import * as trackController from "./track.controller";
import { upload } from "../../middleware/upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorizedMiddleware } from "../../middleware/authorized.middleware";
import { optionalAuthMiddleware } from "../../middleware/optionalAuth.middleware";
import { uploadTrackLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post(
  "/upload",
  uploadTrackLimiter,
  authMiddleware,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  trackController.uploadTrack,
);
router.get("/all", optionalAuthMiddleware, trackController.getAllTracks);
router.get("/search", optionalAuthMiddleware, trackController.searchTracks);
router.get("/:trackID", optionalAuthMiddleware, trackController.getSingleTrack);
router.get(
  "/user/:username",
  optionalAuthMiddleware,
  trackController.getUsersTracks,
);
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
router.patch(
  "/:trackId/play",
  optionalAuthMiddleware,
  trackController.incrementTrackPlays,
);

export default router;
