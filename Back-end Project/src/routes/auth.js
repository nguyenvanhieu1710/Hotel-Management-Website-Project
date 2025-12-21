import express from "express";
import { Register, Login, getMe } from "../controllers/auth.js";
import {
  authLimiter,
  createAccountLimiter,
} from "../middleware/rateLimiter.js";
import { authenticate } from "../middleware/checkPermission.js";

const router = express.Router();

router.post("/auth/register", createAccountLimiter, Register);
router.post("/auth/login", authLimiter, Login);
router.get("/auth/me", authenticate, getMe);

export default router;
