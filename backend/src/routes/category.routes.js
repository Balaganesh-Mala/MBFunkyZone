import express from "express";
import upload from "../middleware/categoryUpload.middleware.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public route → anyone can see categories
router.get("/", getCategories);

// Admin routes → protected
router.post("/", protect, isAdmin, upload.single("image"), createCategory);
router.put("/:id", protect, isAdmin, upload.single("image"), updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
