import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

const router = express.Router();

router.get("/user/get-all", getAllUsers);
router.get("/user/get-data-by-id/:id", getUserById);
router.post("/user/create", createUser);
router.put("/user/update", updateUser);
router.delete("/user/delete/:id", deleteUser);

export default router;
