import express from "express";

import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  sendEmail,
  sendBookingEmail,
  getAccountStatistics,
  updateAccountStatus,
  changePassword,
} from "../controllers/account.js";

const router = express.Router();

// Statistics (Admin only)
router.get(
  "/account/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAccountStatistics
);

// Public routes
router.post("/account/send-email", sendEmail);
router.post("/account/send-booking-email", sendBookingEmail);

// Admin routes - RESTful endpoints
router.get("/account", ...checkPermission([USER_ROLES.ADMIN]), getAccounts);
router.get(
  "/account/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAccountById
);
router.post("/account", ...checkPermission([USER_ROLES.ADMIN]), createAccount);
router.put(
  "/account/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateAccount
);
router.put(
  "/account/:id/status",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateAccountStatus
);
router.put(
  "/account/:id/change-password",
  ...checkPermission([USER_ROLES.ADMIN]),
  changePassword
);
router.delete(
  "/account/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteAccount
);

// Legacy endpoints for backward compatibility
router.get(
  "/account/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAccounts
);
router.get(
  "/account/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAccountById
);
router.post(
  "/account/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createAccount
);
router.put(
  "/account/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateAccount
);
router.delete(
  "/account/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteAccount
);

export default router;
