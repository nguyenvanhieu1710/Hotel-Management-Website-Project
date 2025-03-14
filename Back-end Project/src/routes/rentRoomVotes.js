import express from "express";

import {
  getAll,
  getById,
  createRentRoomVote,
  updateRentRoomVote,
  deleteRentRoomVote,
} from "../controllers/RentRoomVotesController.js";

const router = express.Router();

router.get("/rent-room-vote/get-all", getAll);
router.get("/rent-room-vote/get-data-by-id/:id", getById);
router.post("/rent-room-vote/create", createRentRoomVote);
router.put("/rent-room-vote/update", updateRentRoomVote);
router.delete("/rent-room-vote/delete/:id", deleteRentRoomVote);
export default router;
