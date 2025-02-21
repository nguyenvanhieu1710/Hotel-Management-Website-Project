import express from "express";

import {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

const router = express.Router();

router.get("/product/get-all", getAllProduct);
router.get("/product/get-data-by-id/:id", getProductById);
router.post("/product/create", createProduct);
router.put("/product/update", updateProduct);
router.delete("/product/delete/:id", deleteProduct);

export default router;
