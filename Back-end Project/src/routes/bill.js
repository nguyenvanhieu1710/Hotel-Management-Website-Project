import express from "express";
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
} from "../controllers/bill.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful CRUD operations
router.get(
  "/bill",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllBills
);

router.get(
  "/bill/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getBillById
);

router.post(
  "/bill",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  createBill
);

router.put(
  "/bill/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateBill
);

router.delete("/bill/:id", ...checkPermission([USER_ROLES.ADMIN]), deleteBill);

export default router;
