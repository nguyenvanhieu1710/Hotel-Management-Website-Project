import express from "express";

import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.js";

const router = express.Router();

router.get("/staff/get-all", getAllStaff);
router.get("/staff/get-data-by-id/:id", getStaffById);
router.post("/staff/create", createStaff);
router.put("/staff/update", updateStaff);
router.delete("/staff/delete/:id", deleteStaff);

export default router;
