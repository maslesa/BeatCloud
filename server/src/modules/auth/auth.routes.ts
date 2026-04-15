import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/verify-email", authController.verifyEmail);

router.get("/google", authController.googleAuthStartHandler);
router.get("/google/callback", authController.googleAuthCallbackHandler);

router.get("/me", authController.me);

export default router;
