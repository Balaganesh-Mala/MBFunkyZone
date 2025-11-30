import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { apiGetUserCart } from "../api/cart.api.js";

const Cart = () => {
  const { cartItems, setCartItems, updateQtyBackend, removeItemBackend, clearCartBackend } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Load cart on page open
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiGetUserCart();
        setCartItems(res.data.cart.items);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleQty = async (productId, qty) => {
    if (qty <= 0) return handleRemove(productId);
    try {
      setLoading(true);
      const data = await updateQtyBackend(productId, qty);
      if (data.success) {
        Swal.fire("Updated ✅", "Cart quantity updated", "success");
      }
    } catch (err) {
      Swal.fire("Error ❌", err.response?.data?.message || "Failed to update qty", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setLoading(true);
      const data = await removeItemBackend(productId);
      if (data.success) {
        Swal.fire("Removed ✅", "Item removed from cart", "success");
      }
    } catch {
      Swal.fire("Error ❌", "Failed to remove item", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      const data = await clearCartBackend();
      if (data.success) {
        Swal.fire("Cart Cleared 🧹", "Your cart has been cleared", "success");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-10 bg-gray-50 min-h-screen relative">

      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col justify-center items-center z-[2000]">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-xs font-bold uppercase">Please wait...</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white border rounded-2xl shadow-sm p-5 sm:p-6">

        <h2 className="text-lg sm:text-2xl font-extrabold mb-6 flex items-center gap-2">
          <FaShoppingCart /> Your Cart
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cartItems.length === 0 && <p className="text-sm text-gray-500">Cart is empty</p>}

          {cartItems.map((item) => (
            <div key={item.product?._id} className="flex gap-4 border bg-gray-50 rounded-xl p-4">

              <img
                src={item.product?.images?.[0] || "/placeholder.png"}
                alt={item.product?.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />

              <div className="flex-1">
                <p className="font-semibold text-sm">{item.product?.name}</p>
                <p className="font-bold text-sm">₹{item.price.toLocaleString()}</p>

                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => handleQty(item.product._id, item.quantity - 1)} className="border rounded-full w-6 h-6 bg-white text-xs">−</button>
                  <span className="text-xs">{item.quantity}</span>
                  <button onClick={() => handleQty(item.product._id, item.quantity + 1)} className="border rounded-full w-6 h-6 bg-white text-xs">+</button>
                </div>
              </div>

              {/* Delete */}
              <button onClick={() => handleRemove(item.product._id)} className="text-gray-400 hover:text-red-500 text-sm">
                <FaTrash />
              </button>

            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-6">
          <p className="font-extrabold text-lg">Total: ₹{total.toLocaleString()}</p>

          <div className="flex gap-3 mt-4 sm:mt-0">
            {cartItems.length > 0 && (
              <button onClick={handleClear} className="bg-gray-100 border text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2">
                <FaTrash /> Clear Cart
              </button>
            )}
            <button onClick={() => navigate("/checkout")} className="bg-black text-white text-xs sm:text-sm px-6 py-2 rounded-full hover:bg-gray-800">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
