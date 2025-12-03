// server/models/Product.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const sizeSchema = new mongoose.Schema(
  {
    shirt: [{ type: String }],
    pant: [{ type: String }], // e.g. 28, 30, 32 ...
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },

    rating: { type: Number, default: 0 }, // average rating
    ratings: { type: Number, default: 0 }, // total rating count if needed

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // I want linked Category
    brand: { type: String, required: true },

    stock: { type: Number, required: true, default: 0 },

    images: [{ type: String, required: true }], // Cloudinary URLs in real backend

    sizes: sizeSchema, // { shirt: [...], pant: [...] }

    description: { type: String, default: "" },

    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;