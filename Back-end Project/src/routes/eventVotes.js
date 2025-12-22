import express from "express";
import {
  getAllEventVotesController,
  getEventVotesByIdController,
  createEventVoteController,
  updateEventVoteController,
  deleteEventVoteController,
  getEventVotesByEventIdController,
  getEventVotesByUserIdController,
  getEventVoteStatisticsController,
} from "../controllers/eventVotes.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful CRUD operations
router.get(
  "/event-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllEventVotesController
);

router.get(
  "/event-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventVotesByIdController
);

router.post(
  "/event-votes",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.USER]),
  createEventVoteController
);

router.put(
  "/event-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateEventVoteController
);

router.delete(
  "/event-votes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEventVoteController
);

// Additional endpoints
router.get(
  "/event-votes/event/:eventId",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventVotesByEventIdController
);

router.get(
  "/event-votes/user/:userId",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.USER]),
  getEventVotesByUserIdController
);

router.get(
  "/event-votes/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEventVoteStatisticsController
);

export default router;
