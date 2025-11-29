import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";
import { uploadCategoryImage } from "../middleware/categoryUpload.middleware.js";

//
// ➕ Create Category (Admin used later)
//
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Category name is required" });
  }

  if (await Category.findOne({ name })) {
    return res.status(400).json({ success: false, message: "Category already exists" });
  }

  let uploadedImage = {};
  if (req.file) {
    const result = await uploadCategoryImage(req.file.buffer, req.file.originalname);
    uploadedImage = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  const category = await Category.create({
    name,
    description,
    image: uploadedImage,
  });

  res.status(201).json({
    success: true,
    message: "Category created ✅",
    category
  });
});

//
// 📦 Get all categories (Public)
//
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, categories });
});

//
// ✏ Update Category (Admin used later)
//
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success:false, message: "Category not found" });
  }

  let uploadedImage = category.image;
  if (req.file) {
    const result = await uploadCategoryImage(req.file.buffer, req.file.originalname);
    uploadedImage = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }

  category.name = name ?? category.name;
  category.description = description ?? category.description;
  category.image = uploadedImage;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated ✅",
    category
  });
});

//
// ❌ Delete Category (Admin used later)
//
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success:false, message: "Category not found" });
  }

  await category.deleteOne();
  res.status(200).json({ success:true, message: "Category deleted ✅" });
});
