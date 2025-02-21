import express from "express";

import { checkPermission } from "../middleware/checkPermission";
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/account.js";

const router = express.Router();

router.get("/account/get-all", checkPermission, getAccounts);
router.get("/account/get-data-by-id/:id", checkPermission, getAccountById);
router.post("/account/create", checkPermission, createAccount);
router.put("/account/update", checkPermission, updateAccount);
router.delete("/account/delete/:id", checkPermission, deleteAccount);

export default router;
