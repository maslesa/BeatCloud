import { Router } from "express";
import * as userController from "./user.controller";

const router = Router();

router.get("/:username", userController.getUserByUsername);

export default router;
