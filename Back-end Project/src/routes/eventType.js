import express from "express";
import {
  getAllEventType,
  getEventTypeByIdController,
  createEventTypeController,
  updateEventTypeController,
  deleteEventTypeController,
} from "../controllers/eventType.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful CRUD operations
router.get(
  "/event-type",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllEventType
);

router.get(
  "/event-type/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventTypeByIdController
);

router.post(
  "/event-type",
  ...checkPermission([USER_ROLES.ADMIN]),
  createEventTypeController
);

router.put(
  "/event-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateEventTypeController
);

router.delete(
  "/event-type/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEventTypeController
);

// Legacy CRUD operations (for backward compatibility)
router.get(
  "/event-type/get-all",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllEventType
);

router.get(
  "/event-type/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventTypeByIdController
);

router.post(
  "/event-type/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createEventTypeController
);

router.put(
  "/event-type/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateEventTypeController
);

router.delete(
  "/event-type/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEventTypeController
);

export default router;
