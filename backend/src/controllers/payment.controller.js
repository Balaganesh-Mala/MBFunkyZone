import asyncHandler from "express-async-handler";
import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

//
// 💰 Create Razorpay Order
//
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success:false, message:"Invalid amount ❌" });
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    razorpay_order_id: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});

//
// ✅ Verify Payment and Save Order
//
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ success:false, message:"Invalid signature ❌" });
  }

  const order = await Order.findById(req.body.orderId);
  if (order) {
    order.paymentStatus = "Paid";
    order.razorpay_payment_id = razorpay_payment_id;
    await order.save();
  }

  const payment = await Payment.create({
    user: req.user?.id || null,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount: req.body.amount,
    status: "Success",
  });

  res.status(200).json({ success:true, message:"Payment verified ✅", payment });
});

//
// 📦 Fetch My Payments (User)
//
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user?.id || null }).sort({ createdAt:-1 });
  res.status(200).json({ success:true, payments });
});

//
// 🧭 Fetch All Payments (Admin)
//
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate("user", "name email").sort({ createdAt:-1 });
  res.status(200).json({ success:true, payments });
});
