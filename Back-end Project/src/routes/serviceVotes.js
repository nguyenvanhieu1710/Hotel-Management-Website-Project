import express from "express";

import {
  getAllServiceVotes,
  getServiceVotesById,
  createServiceVotes,
  updateServiceVotes,
  deleteServiceVotes,
} from "../controllers/serviceVotes.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// RESTful endpoints
router.get(
  "/serviceVotes",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllServiceVotes
);
router.get(
  "/serviceVotes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceVotesById
);
router.post(
  "/serviceVotes",
  ...checkPermission([USER_ROLES.ADMIN]),
  createServiceVotes
);
router.put(
  "/serviceVotes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateServiceVotes
);
router.delete(
  "/serviceVotes/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteServiceVotes
);

// Legacy endpoints for backward compatibility
router.get(
  "/service-votes/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllServiceVotes
);
router.get(
  "/service-votes/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getServiceVotesById
);
router.post(
  "/service-votes/create",
  ...checkPermission([USER_ROLES.ADMIN]),
  createServiceVotes
);
router.put(
  "/service-votes/update",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateServiceVotes
);
router.delete(
  "/service-votes/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteServiceVotes
);

export default router;
