import express from "express";

import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStatistics,
  getPositions,
} from "../controllers/staff.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Statistics and positions (Admin only)
router.get(
  "/staff/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN]),
  getStaffStatistics
);
router.get(
  "/staff/positions/list",
  ...checkPermission([USER_ROLES.ADMIN]),
  getPositions
);

// CRUD operations
router.get(
  "/staff/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllStaff
);
router.get(
  "/staff/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getStaffById
);
router.post(
  "/staff/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createStaff
);
router.put(
  "/staff/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateStaff
);
router.delete(
  "/staff/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteStaff
);

export default router;
