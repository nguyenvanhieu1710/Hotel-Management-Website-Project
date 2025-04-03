import express from "express";

import { payment, checkOrderStatus } from "../controllers/payment";

const router = express.Router();

router.post("/payment", payment);
router.post("/check-order-status/:id", checkOrderStatus);

export default router;
