import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary as uploadMultipleToCloudinary } from "../middleware/upload.middleware.js";

// 🔥 Calculate total stock
const calculateTotalStock = (sizesArray) => {
  return sizesArray.reduce((sum, item) => sum + (item.stock || 0), 0);
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      mrp,
      category,
      brand,
      sizes,
      description,
      isFeatured,
      isBestSeller,
      isActive,
    } = req.body;

    // Validate category
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists || !categoryExists.isActive) {
      return res
        .status(400)
        .json({ message: "Category not found or inactive" });
    }

    // Validate images
    if (!req.files?.images || req.files.images.length !== 4) {
      return res
        .status(400)
        .json({ message: "Please upload exactly 4 images" });
    }

    const imageUrls = [];
    for (const file of req.files.images) {
      const url = await uploadMultipleToCloudinary(
        file.buffer,
        file.originalname
      );
      imageUrls.push(url);
    }

    // ⭐ Parse sizes JSON
    const parsedSizes = sizes ? JSON.parse(sizes) : {};

    // ⭐ Convert {shirt:[], pant:[]} → unified array
    let unifySizes = [];

    if (parsedSizes.shirt) {
      parsedSizes.shirt.forEach((s) => {
        unifySizes.push({
          type: "shirt",
          size: s.size,
          stock: s.stock ?? 0,
        });
      });
    }

    if (parsedSizes.pant) {
      parsedSizes.pant.forEach((s) => {
        unifySizes.push({
          type: "pant",
          size: s.size,
          stock: s.stock ?? 0,
        });
      });
    }

    // ⭐ Auto totalStock
    const totalStock = calculateTotalStock(unifySizes);

    // ⭐ Create product
    const product = new Product({
      name,
      price,
      mrp,
      category,
      brand,
      sizes: unifySizes,
      totalStock,
      images: imageUrls,
      description,
      isFeatured,
      isBestSeller,
      isActive: isActive ?? true,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "", minRating = "", sort = "" } = req.query;

    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let productsQuery = Product.find(query).populate("category");

    if (sort === "low-high") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "high-low") productsQuery = productsQuery.sort({ price: -1 });
    if (sort === "top-rated")
      productsQuery = productsQuery.sort({ rating: -1 });

    const products = await productsQuery; // ✅ NO LIMIT, returns all
    res.status(200).json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category"); // ✅ Populate linked category
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found " });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error " });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const {
      name,
      price,
      mrp,
      category,
      brand,
      sizes,        // can be object or JSON string
      description,
      isFeatured,
      isBestSeller,
      isActive,
    } = req.body;

    // ------------------------------
    // CATEGORY UPDATE
    // ------------------------------
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists || !categoryExists.isActive) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.category = categoryExists._id;
    }

    // ------------------------------
    // BASIC FIELDS
    // ------------------------------
    if (name) product.name = name;
    if (price) product.price = price;
    if (mrp) product.mrp = mrp;
    if (brand) product.brand = brand;
    if (description) product.description = description;

    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isActive !== undefined) product.isActive = isActive;

    // ------------------------------
    // ⭐ FIXED — HANDLE SIZES
    // Accepts both:
    //   1) sizes = "[{...}]" (string from AddProduct)
    //   2) sizes = [{...}]   (object from EditProduct)
    // ------------------------------
    if (sizes) {
      let parsedSizes = sizes;

      // Convert only when string
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Invalid sizes JSON format",
          });
        }
      }

      // parsedSizes is an array: [{type,size,stock}, ...]
      product.sizes = parsedSizes;

      // Recalculate total stock
      product.totalStock = parsedSizes.reduce(
        (sum, s) => sum + (s.stock || 0),
        0
      );
    }

    // ------------------------------
    // SAVE UPDATED PRODUCT
    // ------------------------------
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userName = req.user?.name;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  product.reviews.push({
    name: userName,
    rating: Number(rating),
    comment,
  });

  // update average rating
  const allReviews = product.reviews; // ✅ correct field
  const totalReviews = allReviews.length;
  const avgRating =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  product.rating = avgRating; // ✅ store average rating
  await product.save();

  product.rating = avgRating;
  await product.save();

  res.status(201).json({ success: true, message: "Review added ✅", product });
});

// ⭐ Get product reviews (public)
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id, "reviews rating");
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
  res
    .status(200)
    .json({ success: true, reviews: product.reviews, rating: product.rating });
});
