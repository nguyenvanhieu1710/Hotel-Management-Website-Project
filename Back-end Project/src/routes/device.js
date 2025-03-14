import express from "express";
import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/device.js";

const router = express.Router();

router.get("/device/get-all", getAllDevices);
router.get("/device/get-data-by-id/:id", getDeviceById);
router.post("/device/create", createDevice);
router.put("/device/update", updateDevice);
router.delete("/device/delete/:id", deleteDevice);
export default router;
