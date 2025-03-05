import express from "express";

import {
  getAllServiceType,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} from "../controllers/serviceType.js";

const router = express.Router();

router.get("/service-type/get-all", getAllServiceType);
router.get("/service-type/get-data-by-id/:id", getServiceTypeById);
router.post("/service-type/create", createServiceType);
router.put("/service-type/update", updateServiceType);
router.delete("/service-type/delete/:id", deleteServiceType);

export default router;
