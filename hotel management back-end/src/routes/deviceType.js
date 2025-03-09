import express from "express";
import {
  getAll,
  getById,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/deviceType.js";

const router = express.Router();

router.get("/device-type/get-all", getAll);
router.get("/device-type/get-data-by-id/:id", getById);
router.post("/device-type/create", createDevice);
router.put("/device-type/update", updateDevice);
router.delete("/device-type/delete/:id", deleteDevice);
export default router;
