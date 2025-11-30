import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { uploadToCloudinary as uploadMultipleToCloudinary } from "../middleware/upload.middleware.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      mrp,
      category,
      brand,
      stock,
      sizes,
      description,
      isFeatured,
      isBestSeller,
      isActive
    } = req.body;

    // ✅ NEW: Validate category exists in DB
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid Category ID " });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists || !categoryExists.isActive) {
      return res.status(400).json({ message: "Invalid Category Category not found or inactive" });
    }

    // ✅ Your existing image validation
    if (!req.files?.images || req.files.images.length !== 4) {
      return res.status(400).json({ message: "Please upload exactly 4 images" });
    }

    // ✅ Your existing Cloudinary upload loop
    const imageUrls = [];
    for (const file of req.files.images) {
      const url = await uploadMultipleToCloudinary(file.buffer, file.originalname);
      imageUrls.push(url);
    }

    // ✅ Create product with category linked
    const product = new Product({
      name,
      price: Number(price),
      mrp: Number(mrp),
      category: categoryExists._id, // ✅ category linked as ObjectId
      brand,
      stock: Number(stock),
      sizes: sizes ? JSON.parse(sizes) : {},
      images: imageUrls,
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isActive: isActive !== undefined ? isActive : true,
      description
    });

    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created ",
      product: savedProduct
    });

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error ", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      minRating = "",
      page = 1,
      limit = 10,
      sort = ""
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ NEW: filter using category ObjectId instead of string
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let productsQuery = Product.find(query).populate("category"); // ✅ Populate linked category

    if (sort === "low-high") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "high-low") productsQuery = productsQuery.sort({ price: -1 });
    if (sort === "top-rated") productsQuery = productsQuery.sort({ rating: -1 });

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await productsQuery.skip(skip).limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error " });
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
    if (!product) return res.status(404).json({ message: "Product not found ❌" });

    const {
      name,
      price,
      mrp,
      category,
      brand,
      stock,
      sizes,
      description,
      isFeatured,
      isBestSeller,
      isActive
    } = req.body;

    // ✅ NEW: If category updating, check exists
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists || !categoryExists.isActive) {
        return res.status(400).json({ message: "Invalid Category" });
      }
      product.category = categoryExists._id; // ✅ update linked category
    }

    // ✅ Your existing update logic
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.mrp = mrp ?? product.mrp;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;
    product.description = description ?? product.description;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isBestSeller = isBestSeller ?? product.isBestSeller;
    product.isActive = isActive ?? product.isActive;

    if (sizes) {
      product.sizes = sizes;
    }

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product updated successfully ",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error " });
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
