import express from "express";
import {
  getAllBookingVotes,
  getBookingVotesById,
  createBookingVotes,
  updateBookingVotes,
  deleteBookingVotes,
} from "../controllers/bookingVotes.js";
const router = express.Router();

router.get("/booking-votes/get-all", getAllBookingVotes);
router.get("/booking-votes/get-data-by-id/:id", getBookingVotesById);
router.post("/booking-votes/create", createBookingVotes);
router.put("/booking-votes/update", updateBookingVotes);
router.delete("/booking-votes/delete/:id", deleteBookingVotes);

export default router;
