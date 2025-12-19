import express from "express";
import {
  getAll,
  getById,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/deviceType.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful endpoints
router.get("/device-type", ...checkPermission([USER_ROLES.ADMIN]), getAll);
router.get("/device-type/:id", ...checkPermission([USER_ROLES.ADMIN]), getById);
router.post(
  "/device-type",
  ...checkPermission([USER_ROLES.ADMIN]),
  createDevice
);
router.put(
  "/device-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateDevice
);
router.delete(
  "/device-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteDevice
);

// Legacy endpoints for backward compatibility
router.get(
  "/device-type/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAll
);
router.get(
  "/device-type/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getById
);
router.post(
  "/device-type/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createDevice
);
router.put(
  "/device-type/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateDevice
);
router.delete(
  "/device-type/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteDevice
);

export default router;
