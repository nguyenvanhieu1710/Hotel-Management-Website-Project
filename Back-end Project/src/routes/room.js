import express from "express";

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/room.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Public endpoints (no authentication required)
router.get("/rooms/public", getAllRooms);
router.get("/rooms/public/:id", getRoomById);

// RESTful endpoints (Admin only)
router.get("/room", ...checkPermission([USER_ROLES.ADMIN]), getAllRooms);
router.get("/room/:id", ...checkPermission([USER_ROLES.ADMIN]), getRoomById);
router.post("/room", ...checkPermission([USER_ROLES.ADMIN]), createRoom);
router.put("/room/:id", ...checkPermission([USER_ROLES.ADMIN]), updateRoom);
router.delete("/room/:id", ...checkPermission([USER_ROLES.ADMIN]), deleteRoom);

// Legacy endpoints for backward compatibility (Admin only)
router.get(
  "/rooms/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllRooms
);
router.get(
  "/rooms/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getRoomById
);
router.post(
  "/rooms/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createRoom
);
router.put("/rooms/update", ...checkPermission([USER_ROLES.ADMIN]), updateRoom);
router.delete(
  "/rooms/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteRoom
);

export default router;
