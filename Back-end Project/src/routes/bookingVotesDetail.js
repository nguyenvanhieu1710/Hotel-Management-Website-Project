import express from "express";
import {
  getAllBookingVotesDetail,
  getBookingVotesDetailById,
  createBookingVotesDetail,
  updateBookingVotesDetail,
  deleteBookingVotesDetail,
} from "../controllers/bookingVotesDetail.js";

const router = express.Router();

router.get("/booking-votes-detail/get-all", getAllBookingVotesDetail);
router.get(
  "/booking-votes-detail/get-data-by-id/:id",
  getBookingVotesDetailById
);
router.post("/booking-votes-detail/create", createBookingVotesDetail);
router.put("/booking-votes-detail/update", updateBookingVotesDetail);
router.delete("/booking-votes-detail/delete/:id", deleteBookingVotesDetail);

export default router;
