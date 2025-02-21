import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.js";

const router = express.Router();

router.get("/event/get-all", getEvents);
router.get("/event/get-data-by-id/:id", getEventById);
router.post("/event/create", createEvent);
router.put("/event/update", updateEvent);
router.delete("/event/delete/:id", deleteEvent);

export default router;
