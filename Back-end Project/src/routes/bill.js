import express from "express";

import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/bill";

const router = express.Router();

router.get("/bill", getAllBills);
router.get("/bill/:id", getBillById);
router.post("/bill", createBill);
router.put("/bill/:id", updateBill);
router.delete("/bill/:id", deleteBill);

export default router;
