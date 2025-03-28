import express from "express";

import {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
} from "../controllers/evaluation";

const router = express.Router();

router.get("/evaluation", getAllEvaluations);
router.get("/evaluation/:id", getEvaluationById);
router.post("/evaluation", createEvaluation);
router.put("/evaluation/:id", updateEvaluation);
router.delete("/evaluation/:id", deleteEvaluation);

export default router;
