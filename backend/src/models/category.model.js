import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  public_id: String,
  url: String,
}, { _id: false });

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: imageSchema,
    isActive: { type: Boolean, default: true }, // optional, helps filtering
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
