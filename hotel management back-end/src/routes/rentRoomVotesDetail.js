import express from "express";

import {
  getAll,
  getById,
  createRentRoomVotesDetail,
  updateRentRoomVotesDetail,
  deleteRentRoomVotesDetail,
} from "../controllers/RentRoomVotesDetailController.js";

const router = express.Router();

router.get("/rent-room-vote-detail/get-all", getAll);
router.get("/rent-room-vote-detail/get-data-by-id/:id", getById);
router.post("/rent-room-vote-detail/create", createRentRoomVotesDetail);
router.put("/rent-room-vote-detail/update", updateRentRoomVotesDetail);
router.delete("/rent-room-vote-detail/delete/:id", deleteRentRoomVotesDetail);

export default router;
