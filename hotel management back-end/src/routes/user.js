import express from "express";
import {
  getAll,
  getById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/user/get-all", getAll);
router.get("/user/get-data-by-id/:id", getById);
router.post("/user/create", createUser);
router.put("/user/update", updateUser);
router.delete("/user/delete/:id", deleteUser);

export default router;
