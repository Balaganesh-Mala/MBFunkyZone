import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductReviews,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// 🌍 Public routes (no login needed)
router.get("/", getProducts); // ✅ anyone can view all products
router.get("/:id", getProductById); // ✅ anyone can view single product

// 🔐 Admin protected routes
router.post(
  "/upload",
  protect,
  isAdmin,
  upload.fields([{ name: "images", maxCount: 4 }]),
  createProduct
);

router.put("/:id", protect, isAdmin, updateProduct);

router.delete("/:id", protect, isAdmin, deleteProduct);

// ⭐ Product Reviews
router.post("/:id/review", protect, addProductReview);
router.get("/:id/reviews", getProductReviews);

export default router;
