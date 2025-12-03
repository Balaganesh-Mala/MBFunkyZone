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
    const product = products.find(
      (p) => String(p._id) === String(item.productId)
    );

    if (!product) throw new Error(`Product not found: ${item.productId}`);

    // ✅ Find size directly from flat sizes[]
    const selectedSize = product.sizes?.find(
      (s) => s.type === item.type && s.size === item.size
    );

    if (!selectedSize) {
      throw new Error(`Size ${item.size} (${item.type}) not available`);
    }

    if (selectedSize.stock < item.quantity) {
      throw new Error(
        `Not enough stock for ${product.name}. Only ${selectedSize.stock} left`
      );
    }

    validatedItems.push({
      productId: product._id,
      name: product.name,
      image: item.image || product.images[0],
      price: product.price,
      quantity: item.quantity,
      type: item.type,
      size: item.size,
    });

    itemsPrice += product.price * item.quantity;
  }

  return { validatedItems, itemsPrice };
};

// 🔧 Helper: reduce stock for selected size
const updateStock = async (item, session) => {
  const product = await Product.findById(item.productId).session(session);

  if (!product) {
    throw new Error(`Product not found while updating stock: ${item.productId}`);
  }

  const sizeEntry = product.sizes?.find(
    (s) => s.type === item.type && s.size === item.size
  );

  if (!sizeEntry) {
    throw new Error(
      `Size ${item.size} (${item.type}) not found while updating stock`
    );
  }

  if (sizeEntry.stock < item.quantity) {
    throw new Error(
      `Not enough stock for ${product.name}. Only ${sizeEntry.stock} left`
    );
  }

  sizeEntry.stock -= item.quantity;

  if (typeof product.totalStock === "number") {
    product.totalStock -= item.quantity;
    if (product.totalStock < 0) product.totalStock = 0;
  }

  await product.save({ session });
};

//
// 🛒 Place Order (Checkout API)
//
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Cart is empty ❌" });
  }

  const { validatedItems, itemsPrice } = await validateOrderItems(orderItems);

  const totalPrice = itemsPrice + (shippingPrice || 0);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await Order.create(
      [
        {
          user: req.user?._id || null,
          orderItems: validatedItems,
          shippingAddress,
          itemsPrice,
          shippingPrice: shippingPrice || 0,
          totalPrice,
          paymentMethod,
          paymentStatus: "Pending",
          orderStatus: "Processing",
        },
      ],
      { session }
    );

    for (const item of validatedItems) {
      await updateStock(item, session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order placed successfully 🎉",
      order: order[0],
    });
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
  const orders = await Order.find({ user: req.user?._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, orders });
});

//
// 🧭 Get All Orders (Admin)
//
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

//
// ⚙ Update Order Status (Admin)
//
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: "Order not found ❌" });
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.paymentStatus = "Paid";
    order.deliveredAt = new Date();
  }

  await order.save();

  res
    .status(200)
    .json({ success: true, message: "Order updated ✅", order });
});

//
// ❌ Delete Order (Admin)
//
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res
      .status(404)
      .json({ success: false, message: "Order not found ❌" });
  }
  await order.deleteOne();
  res.status(200).json({ success: true, message: "Order deleted ✅" });
});
