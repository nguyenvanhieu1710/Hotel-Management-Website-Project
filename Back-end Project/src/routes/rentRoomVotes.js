import express from "express";

import {
  getAllRentRoomVotes,
  getRentRoomVotesById,
  createRentRoomVotes,
  updateRentRoomVotes,
  deleteRentRoomVotes,
} from "../controllers/rentRoomVotes.js";

const router = express.Router();

router.get("/rent-room-votes/get-all", getAllRentRoomVotes);
router.get("/rent-room-votes/get-data-by-id/:id", getRentRoomVotesById);
router.post("/rent-room-votes/create", createRentRoomVotes);
router.put("/rent-room-votes/update", updateRentRoomVotes);
router.delete("/rent-room-votes/delete/:id", deleteRentRoomVotes);

export default router;
