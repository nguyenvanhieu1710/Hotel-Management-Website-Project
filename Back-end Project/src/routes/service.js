import express from "express";

import {
  getService,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service";

const router = express.Router();

router.get("/service/get-all", getService);
router.get("/service/get-data-by-id/:id", getServiceById);
router.post("/service/create", createService);
router.put("/service/update", updateService);
router.delete("/service/delete/:id", deleteService);

export default router;
