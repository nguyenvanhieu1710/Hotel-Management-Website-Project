import express from "express";
import {
  getAllRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../controllers/roomType.js";

const router = express.Router();

router.get("/room-type/get-all", getAllRoomTypes);
router.get("/room-type/get-data-by-id/:id", getRoomTypeById);
router.post("/room-type/create", createRoomType);
router.put("/room-type/update", updateRoomType);
router.delete("/room-type/delete/:id", deleteRoomType);

export default router;
