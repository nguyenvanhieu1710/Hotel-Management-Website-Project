import express from "express";

import {
  getService,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful endpoints
router.get("/service", ...checkPermission([USER_ROLES.ADMIN]), getService);
router.get(
  "/service/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceById
);
router.post("/service", ...checkPermission([USER_ROLES.ADMIN]), createService);
router.put(
  "/service/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateService
);
router.delete(
  "/service/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteService
);

// Legacy endpoints for backward compatibility
router.get(
  "/service/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getService
);
router.get(
  "/service/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceById
);
router.post(
  "/service/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createService
);
router.put(
  "/service/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateService
);
router.delete(
  "/service/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteService
);

export default router;
