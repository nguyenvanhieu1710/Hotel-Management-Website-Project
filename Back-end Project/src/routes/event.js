import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventsByType,
  getEventStatistics,
  updateEventStatus,
} from "../controllers/event.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful CRUD operations
router.get(
  "/event",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEvents
);

router.get(
  "/event/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventById
);

router.post("/event", ...checkPermission([USER_ROLES.ADMIN]), createEvent);

router.put("/event/:id", ...checkPermission([USER_ROLES.ADMIN]), updateEvent);

router.delete(
  "/event/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEvent
);

// Additional endpoints
router.get("/event/upcoming/list", getUpcomingEvents);

router.get("/event/type/:eventTypeId", getEventsByType);

router.get(
  "/event/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventStatistics
);

router.put(
  "/event/:id/status",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateEventStatus
);

// Legacy CRUD operations (for backward compatibility)
router.get(
  "/event/get-all",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEvents
);

router.get(
  "/event/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventById
);

router.post(
  "/event/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createEvent
);

router.put(
  "/event/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateEvent
);

router.delete(
  "/event/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEvent
);

export default router;
