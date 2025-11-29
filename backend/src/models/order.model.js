import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  image: String, // Cloudinary optimized URL
  price: Number,
  quantity: Number,
  size: String,
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, default: null }, // supports guest checkout
    orderNo: { type: Number, unique: true },
    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    itemsPrice: Number,
    shippingPrice: { type: Number, default: 0 },
    totalPrice: Number,
    paymentMethod: { type: String, enum: ["COD", "online"], default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
    deliveredAt: Date,
  },
  { timestamps: true }
);

// Auto generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNo) {
    const last = await Order.findOne().sort({ createdAt: -1 });
    this.orderNo = last ? last.orderNo + 1 : 213301; // starts with 213301
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
