import express from "express";
import {
  getAllBookingVotes,
  getBookingVotesById,
  createBookingVotes,
  updateBookingVotes,
  deleteBookingVotes,
  getBookingStatistics,
  updateBookingStatus,
} from "../controllers/bookingVotes.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Statistics (Admin and Staff only)
router.get(
  "/booking-votes/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getBookingStatistics
);

// RESTful CRUD operations
router.get(
  "/booking-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllBookingVotes
);

// User can view their own bookings
router.get(
  "/booking-votes/user/:userId",
  ...checkPermission([USER_ROLES.USER]),
  getAllBookingVotes
);

router.get(
  "/booking-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER]),
  getBookingVotesById
);

router.post(
  "/booking-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.USER]),
  createBookingVotes
);

router.put(
  "/booking-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateBookingVotes
);

router.delete(
  "/booking-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteBookingVotes
);

// Legacy CRUD operations (for backward compatibility)
router.get(
  "/booking-votes/get-all",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllBookingVotes
);

router.get(
  "/booking-votes/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER]),
  getBookingVotesById
);

router.post(
  "/booking-votes/create",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.USER]),
  createBookingVotes
);

router.put(
  "/booking-votes/update",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.USER]),
  updateBookingVotes
);

router.delete(
  "/booking-votes/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteBookingVotes
);

// Status update
router.put(
  "/booking-votes/:id/status",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateBookingStatus
);

export default router;
