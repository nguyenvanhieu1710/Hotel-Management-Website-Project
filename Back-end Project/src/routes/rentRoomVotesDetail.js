import express from "express";

import {
  getAllRentRoomVotesDetail,
  getRentRoomVotesDetailById,
  createRentRoomVotesDetail,
  updateRentRoomVotesDetail,
  deleteRentRoomVotesDetail,
} from "../controllers/rentRoomVotesDetail.js";

const router = express.Router();

router.get("/rent-room-votes-detail/get-all", getAllRentRoomVotesDetail);
router.get(
  "/rent-room-votes-detail/get-data-by-id/:id",
  getRentRoomVotesDetailById
);
router.post("/rent-room-votes-detail/create", createRentRoomVotesDetail);
router.put("/rent-room-votes-detail/update", updateRentRoomVotesDetail);
router.delete("/rent-room-votes-detail/delete/:id", deleteRentRoomVotesDetail);

export default router;
