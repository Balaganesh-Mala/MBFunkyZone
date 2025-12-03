import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

//
// ⭐ SUPER FAST subtotal using stored price
//
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => {
    if (!item || !item.price || !item.quantity) return sum;
    return sum + item.price * item.quantity;
  }, 0);
};

//
// 🛒 Add item to cart
//
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty, type, size } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // 🔍 Find selected size directly in flat product.sizes array
  const selectedSize = product.sizes?.find(
    (s) => s.type === type && s.size === size
  );

  if (!selectedSize) {
    console.log("DEBUG size not found", {
      body: req.body,
      sizes: product.sizes,
    });
    throw new Error("Selected size not available");
  }

  // 🚨 Stock Validation
  if (selectedSize.stock < qty) {
    throw new Error(`Not enough stock. Only ${selectedSize.stock} available`);
  }

  // 🔍 Find cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  // 🔍 Check if same product + size exists
  const existingItem = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      i.type === type &&
      i.size === size
  );

  if (existingItem) {
    // 🚨 Validate AGAIN after adding
    if (existingItem.quantity + qty > selectedSize.stock) {
      throw new Error(`Only ${selectedSize.stock} items in stock`);
    }

    existingItem.quantity += qty;
  } else {
    cart.items.push({
      product: productId,
      quantity: qty,
      price: product.price,
      type,
      size,
    });
  }

  cart.subtotal = calculateSubtotal(cart.items);
  await cart.save();

  res.status(200).json({ success: true, cart });
});


//
// 📋 Get user cart (AUTO CLEANING)
//
export const getUserCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images stock"
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], subtotal: 0 },
    });
  }

  // 🧹 Remove items whose product has been deleted
  const validItems = cart.items.filter((item) => item.product !== null);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    cart.subtotal = calculateSubtotal(validItems);
    await cart.save();
  }

  res.status(200).json({ success: true, cart });
});

//
// ✏️ Update cart item quantity
//
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, type, size, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) =>
      i.product.toString() === productId &&
      i.type === type &&
      i.size === size
  );

  if (!item) throw new Error("Cart item not found");

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          i.type === type &&
          i.size === size
        )
    );
  } else {
    item.quantity = quantity;
  }

  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});


//
// ❌ Remove item
//
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, type, size } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) =>
      !(
        item.product.toString() === productId &&
        item.type === type &&
        item.size === size
      )
  );

  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart,
  });
});


//
// 🧹 Clear entire cart
//
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  cart.subtotal = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});
