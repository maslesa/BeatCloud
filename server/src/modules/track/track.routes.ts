import { Router } from "express";
import * as trackController from "./track.controller";
import { upload } from "../../middleware/upload.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authorizedMiddleware } from "../../middleware/authorized.middleware";

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
router.get("/all", trackController.getAllTracks);
router.get("/:trackID", trackController.getSingleTrack);
router.get("/user/:username", trackController.getUsersTracks);
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
