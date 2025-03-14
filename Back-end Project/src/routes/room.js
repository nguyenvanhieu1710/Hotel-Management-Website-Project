import express from "express";

import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
 } from "../controllers/room.js";

const router = express.Router();

router.get("/rooms/get-all", getAllRooms);
router.get("/rooms/get-data-by-id/:id", getRoomById);
router.post("/rooms/create", createRoom);
router.put("/rooms/update", updateRoom);
router.delete("/rooms/delete/:id", deleteRoom);

export default router;
