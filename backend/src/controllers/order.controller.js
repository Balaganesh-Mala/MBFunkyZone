import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/**
 * Helper: Validate cart/order items and ensure enough stock
 */
const validateOrderItems = async (items) => {
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  let validatedItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = products.find((p) => String(p._id) === String(item.productId));
    
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    validatedItems.push({
      productId: product._id,
      name: product.name,
      image: item.image || product.images[0], // take at least 1 image
      price: product.price,
      quantity: item.quantity,
      size: item.size || "",
    });

    itemsPrice += product.price * item.quantity;
  }

  return { validatedItems, itemsPrice };
};

//
// 🛒 Place Order (Checkout API)
//
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success:false, message: "Cart is empty ❌" });
  }

  // Validate product stock and calculate total
  const { validatedItems, itemsPrice } = await validateOrderItems(orderItems);

  const totalPrice = itemsPrice + (shippingPrice || 0);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await Order.create([{
      user: req.user?._id || null, // ✅ store correct logged user ID
      orderItems: validatedItems,
      shippingAddress: {
        name:shippingAddress.name,
        street:shippingAddress.street,
        city:shippingAddress.city,
        state:shippingAddress.state,
        pincode:shippingAddress.pincode,
        phone:shippingAddress.phone
      },
      itemsPrice,
      shippingPrice: shippingPrice || 0,
      totalPrice,
      paymentMethod: paymentMethod === "online" ? "online" : "COD", // ✅ store correct enum value
      paymentStatus: "Pending",
      orderStatus: "Processing"
    }], { session });

    // Reduce stock
    const bulkOps = validatedItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOps, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success:true, message:"Order placed ✅", order: order[0] });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});


//
// 📦 Get My Orders (Orders Page - User)
//
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user?._id }).sort({ createdAt: -1 }); // ✅ FIXED
  res.status(200).json({ success: true, orders });
});

//
// 🧭 Get All Orders (Admin)
//
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

//
// ⚙ Update Order Status (Admin)
//
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success:false, message:"Order not found ❌" });
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.paymentStatus = "Paid";
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success:true, message:"Order updated ✅", order });
});

//
// ❌ Delete Order (Admin)
//
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success:false, message:"Order not found ❌" });
  }
  await order.deleteOne();
  res.status(200).json({ success:true, message:"Order deleted ✅" });
});
