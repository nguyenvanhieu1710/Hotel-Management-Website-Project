import express from "express";
import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDevicesByRoom,
  getDevicesByType,
  getDevicesByStatus,
  assignDeviceToRoom,
  removeDeviceFromRoom,
  getDeviceStatistics,
} from "../controllers/device.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Statistics (Admin only)
router.get(
  "/device/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN]),
  getDeviceStatistics
);

// Query operations (Admin and Staff)
router.get(
  "/device/room/:roomId",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getDevicesByRoom
);
router.get(
  "/device/type/:deviceTypeId",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getDevicesByType
);
router.get(
  "/device/status/:status",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getDevicesByStatus
);

// Device assignment (Admin only)
router.put(
  "/device/:id/assign",
  ...checkPermission([USER_ROLES.ADMIN]),
  assignDeviceToRoom
);
router.put(
  "/device/:id/remove",
  ...checkPermission([USER_ROLES.ADMIN]),
  removeDeviceFromRoom
);

// RESTful endpoints
router.get(
  "/device",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllDevices
);
router.get(
  "/device/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getDeviceById
);
router.post("/device", ...checkPermission([USER_ROLES.ADMIN]), createDevice);
router.put("/device/:id", ...checkPermission([USER_ROLES.ADMIN]), updateDevice);
router.delete(
  "/device/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteDevice
);

// Legacy CRUD operations (Admin only)
router.get(
  "/device/get-all",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllDevices
);
router.get(
  "/device/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getDeviceById
);
router.post(
  "/device/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createDevice
);
router.put(
  "/device/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateDevice
);
router.delete(
  "/device/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteDevice
);

export default router;
