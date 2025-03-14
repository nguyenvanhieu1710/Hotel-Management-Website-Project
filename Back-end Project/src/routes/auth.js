import express from "express";

import { Register, Login } from "../controllers/auth.js";

const router = express.Router();

router.post("/auth/register", Register);
router.post("/auth/login", Login);

export default router;
