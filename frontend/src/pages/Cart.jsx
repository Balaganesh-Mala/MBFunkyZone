import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white border rounded-2xl shadow-sm p-5 sm:p-6">

        {/* Header */}
        <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <FaShoppingCart /> Your Cart
        </h2>

        {/* Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cartItems.length === 0 && <p className="text-sm text-gray-500">Cart is empty</p>}

          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 border bg-gray-50 rounded-xl p-4">
              <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />

              <div className="flex-1">
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="font-bold text-sm mt-1">₹{item.price.toLocaleString()}</p>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))} className="border rounded-full w-6 h-6 text-xs bg-white">−</button>
                  <span className="text-xs">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="border rounded-full w-6 h-6 text-xs bg-white">+</button>
                </div>
              </div>

              {/* Remove Button */}
              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition text-sm">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-6">
          <p className="font-extrabold text-lg">Total: ₹{total.toLocaleString()}</p>

          <div className="flex gap-3 mt-4 sm:mt-0">
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="bg-gray-100 border text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2">
                <FaTrash /> Clear Cart
              </button>
            )}
            <button
              onClick={() => navigate("/checkout")}
              className="bg-black text-white text-xs sm:text-sm px-6 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
