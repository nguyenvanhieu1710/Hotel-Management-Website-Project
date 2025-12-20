import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { USER_ROLES } from "../constants/index.js";

const router = express.Router();

// Public endpoints (no authentication required)
router.get("/user/public", getAllUsers); // For homepage reviews display

// RESTful endpoints (Admin only)
router.get("/user", ...checkPermission([USER_ROLES.ADMIN]), getAllUsers);
router.get("/user/:id", ...checkPermission([USER_ROLES.ADMIN]), getUserById);
router.post("/user", ...checkPermission([USER_ROLES.ADMIN]), createUser);
router.put("/user/:id", ...checkPermission([USER_ROLES.ADMIN]), updateUser);
router.delete("/user/:id", ...checkPermission([USER_ROLES.ADMIN]), deleteUser);

// Legacy endpoints for backward compatibility (Admin only)
router.get(
  "/user/get-all",
  ...checkPermission([USER_ROLES.ADMIN]),
  getAllUsers
);
router.get(
  "/user/get-data-by-id/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  getUserById
);
router.post("/user/create", ...checkPermission([USER_ROLES.ADMIN]), createUser);
router.put("/user/update", ...checkPermission([USER_ROLES.ADMIN]), updateUser);
router.delete(
  "/user/delete/:id",
  ...checkPermission([USER_ROLES.ADMIN]),
  deleteUser
);

export default router;
