import express from "express";

import {
  getAllServiceVotes,
  getServiceVotesById,
  createServiceVotes,
  updateServiceVotes,
  deleteServiceVotes,
} from "../controllers/serviceVotes";

const router = express.Router();

router.get("/service-votes/get-all", getAllServiceVotes);
router.get("/service-votes/get-data-by-id/:id", getServiceVotesById);
router.post("/service-votes/create", createServiceVotes);
router.put("/service-votes/update", updateServiceVotes);
router.delete("/service-votes/delete/:id", deleteServiceVotes);

export default router;
