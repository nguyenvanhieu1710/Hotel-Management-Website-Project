import express from "express";

import {
  getAllServiceType,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} from "../controllers/serviceType.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful endpoints
router.get(
  "/service-type",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllServiceType
);
router.get(
  "/service-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceTypeById
);
router.post(
  "/service-type",
  ...checkPermission([USER_ROLES.ADMIN]),
  createServiceType
);
router.put(
  "/service-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateServiceType
);
router.delete(
  "/service-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteServiceType
);

// Legacy endpoints for backward compatibility
router.get(
  "/service-type/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllServiceType
);
router.get(
  "/service-type/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceTypeById
);
router.post(
  "/service-type/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createServiceType
);
router.put(
  "/service-type/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateServiceType
);
router.delete(
  "/service-type/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteServiceType
);

export default router;
