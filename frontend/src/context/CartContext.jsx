import React, { createContext, useContext, useState } from "react";
import { apiAddToCart, apiGetUserCart, apiUpdateCartItem, apiRemoveFromCart, apiClearCart } from "../api/cart.api.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Fetch cart from backend
  const fetchCart = async () => {
    const res = await apiGetUserCart();
    setCartItems(res.data.cart.items);
    return res.data;
  };

  // ✅ Add to cart using backend API
  const addToCartBackend = async (productId, quantity = 1) => {
    const res = await apiAddToCart(productId, quantity);
    setCartItems(res.data.cart.items);
    return res.data;
  };

  // ✅ Update QTY using backend API
  const updateQtyBackend = async (productId, quantity) => {
    const res = await apiUpdateCartItem(productId, quantity);
    setCartItems(res.data.cart.items);
    return res.data;
  };

  // ✅ Remove item using backend API
  const removeItemBackend = async (productId) => {
    const res = await apiRemoveFromCart(productId);
    setCartItems(res.data.cart.items);
    return res.data;
  };

  // ✅ Clear cart using backend API
  const clearCartBackend = async () => {
    const res = await apiClearCart();
    setCartItems(res.data.cart.items);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, fetchCart, addToCartBackend, updateQtyBackend, removeItemBackend, clearCartBackend }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
