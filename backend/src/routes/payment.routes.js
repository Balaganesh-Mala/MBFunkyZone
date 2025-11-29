import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public or logged user checkout can call this
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);

// User payment history
router.get("/my-payments", protect, getMyPayments);

// Admin can see everything
router.get("/", protect, isAdmin, getAllPayments);

export default router;
