import express from "express";
import {
  getInventoryReport,
  getTransactionsReport,
  getContactTransactionHistory
} from "../controllers/reportController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

router.get("/inventory", verifyJWT, getInventoryReport);
router.get("/transactions", verifyJWT, getTransactionsReport);
router.get("/contacts/:id/transactions", verifyJWT, getContactTransactionHistory);

export default router;
