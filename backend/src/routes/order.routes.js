import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public guest checkout or logged user checkout
router.post("/", protect, placeOrder); // later we can modify if you want guest without token

// User Orders Page
router.get("/my-orders", protect, getMyOrders);

// Admin Orders Page + Manage
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.delete("/:id", protect, isAdmin, deleteOrder);

export default router;
