import express from "express";
import {
  getAllBookingVotesDetail,
  getBookingVotesDetailById,
} from "../controllers/bookingVotesDetail.js";

const router = express.Router();

router.get("/booking-votes-detail/get-all", getAllBookingVotesDetail);
router.get(
  "/booking-votes-detail/get-data-by-id/:id",
  getBookingVotesDetailById
);

export default router;
