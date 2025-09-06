import express from "express";
import {
  getTransactions,
  getTransaction,
  createTransaction
} from "../controllers/transactionController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .get(verifyJWT, getTransactions)
  .post(verifyJWT, createTransaction);

router.route("/:id")
  .get(verifyJWT, getTransaction);

export default router;
