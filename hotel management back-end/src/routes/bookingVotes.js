import express from "express";
import {
  getAll,
  getById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/bookingVotes.js";
const router = express.Router();

router.get("/booking-votes/get-all", getAll);
router.get("/booking-votes/get-data-by-id/:id", getById);
router.post("/booking-votes/create", createUser);
router.put("/booking-votes/update", updateUser);
router.delete("/booking-votes/delete/:id", deleteUser);

export default router;
