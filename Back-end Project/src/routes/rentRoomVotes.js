import express from "express";
import {
  getAllRentRoomVotes,
  getRentRoomVotesById,
  createRentRoomVotes,
  updateRentRoomVotes,
  deleteRentRoomVotes,
} from "../controllers/rentRoomVotes.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful CRUD operations
router.get(
  "/rent-room-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllRentRoomVotes
);

router.get(
  "/rent-room-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getRentRoomVotesById
);

router.post(
  "/rent-room-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  createRentRoomVotes
);

router.put(
  "/rent-room-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateRentRoomVotes
);

router.delete(
  "/rent-room-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteRentRoomVotes
);

// Legacy CRUD operations (for backward compatibility)
router.get(
  "/rent-room-votes/get-all",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllRentRoomVotes
);

router.get(
  "/rent-room-votes/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getRentRoomVotesById
);

router.post(
  "/rent-room-votes/create",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  createRentRoomVotes
);

router.put(
  "/rent-room-votes/update",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateRentRoomVotes
);

router.delete(
  "/rent-room-votes/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteRentRoomVotes
);

export default router;
