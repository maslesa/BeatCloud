import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { authLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/verify-email", authController.verifyEmail);

router.get("/google", authLimiter, authController.googleAuthStartHandler);
router.get("/google/callback", authController.googleAuthCallbackHandler);

router.get("/me", authController.me);

router.post("/logout", authController.logout);

export default router;
