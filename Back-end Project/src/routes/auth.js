import express from "express";
import { Register, Login } from "../controllers/auth.js";
import {
  authLimiter,
  createAccountLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/auth/register", createAccountLimiter, Register);
router.post("/auth/login", authLimiter, Login);

export default router;
