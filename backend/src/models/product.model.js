import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const sizeStockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // shirt/pant
    size: { type: String, required: true }, // S, XL, 30, 32
    stock: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },

    rating: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: { type: String, required: true },

    // ⭐ Auto-calculated stock
    totalStock: { type: Number, default: 0 },

    images: [{ type: String, required: true }],

    sizes: [sizeStockSchema],

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
