import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} from "../controllers/productController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(verifyJWT, getProducts)
  .post(verifyJWT, createProduct);

router.route("/:id")
  .get(verifyJWT, getProduct)
  .put(verifyJWT, updateProduct)
  .delete(verifyJWT, deleteProduct);

router.route("/:id/stock")
  .patch(verifyJWT, updateStock);

export default router;
