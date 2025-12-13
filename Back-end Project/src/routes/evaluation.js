import express from "express";
import {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByRoom,
  getRoomRatingStats,
  updateEvaluationStatus,
  getEvaluationStatistics,
} from "../controllers/evaluation.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Statistics (Admin and Staff only)
router.get(
  "/evaluation/statistics/summary",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getEvaluationStatistics
);

// Public routes
router.get("/evaluation/room/:roomId", getEvaluationsByRoom);
router.get("/evaluation/room/:roomId/stats", getRoomRatingStats);
router.get("/evaluation/:id", getEvaluationById);

// Admin and Staff routes
router.get(
  "/evaluation",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  getAllEvaluations
);

// Customer routes
router.post(
  "/evaluation",
  ...checkPermission([USER_ROLES.CUSTOMER, USER_ROLES.ADMIN]),
  createEvaluation
);

// Admin routes
router.put(
  "/evaluation/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  updateEvaluation
);

router.put(
  "/evaluation/:id/status",
  ...checkPermission([USER_ROLES.ADMIN, USER_ROLES.STAFF]),
  updateEvaluationStatus
);

router.delete(
  "/evaluation/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteEvaluation
);

export default router;
