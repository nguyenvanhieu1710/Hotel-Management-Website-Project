import express from "express";

import {
  getAllEventType,
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType,
} from "../controllers/eventType.js";

const router = express.Router();

router.get("/event-type/get-all", getAllEventType);
router.get("/event-type/get-data-by-id/:id", getEventTypeById);
router.post("/event-type/create", createEventType);
router.put("/event-type/update", updateEventType);
router.delete("/event-type/delete/:id", deleteEventType);

export default router;
