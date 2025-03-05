import express from "express";
import {
  getAll,
  getById,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/DeviceController.js";

const router = express.Router();

router.get("/device/get-all", getAll);
router.get("/device/get-data-by-id/:id", getById);
router.post("/device/create", createDevice);
router.put("/device/update", updateDevice);
router.delete("/device/delete/:id", deleteDevice);
export default router;
