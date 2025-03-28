import express from "express";

import {
  getAllEventVotes,
  getEventVotesById,
  createEventVotes,
  updateEventVotes,
  deleteEventVotes,
} from "../controllers/eventVotes";

const router = express.Router();

router.get("/event-votes", getAllEventVotes);
router.get("/event-votes/:id", getEventVotesById);
router.post("/event-votes", createEventVotes);
router.put("/event-votes/:id", updateEventVotes);
router.delete("/event-votes/:id", deleteEventVotes);

export default router;
