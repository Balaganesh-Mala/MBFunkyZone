import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import Input from "../components/ui/input.jsx";
import Label from "../components/ui/label.jsx";
import Button from "../components/ui/button.jsx";

import { placeOrder } from "../api/order.api.js";  // ✅ using your order API
import { apiGetUserCart } from "../api/cart.api.js"; // ✅ fetch latest cart from backend

const Checkout = () => {
  const { cartItems, setCartItems, clearCartBackend } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  // ✅ Always load latest cart items from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetUserCart();
        setCartItems(res.data.cart.items);
      } catch (err) {
        console.error("Cart Load Error:", err);
      }
    })();
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // -------------------------
  // ✅ PLACE ORDER
  // -------------------------
  const handlePlaceOrder = async (method) => {
    if (!cartItems.length) {
      return Swal.fire("Cart Empty", "Add some products first", "warning");
    }

    if (!form.name || !form.mobile || !form.address || !form.city || !form.pincode) {
      return Swal.fire("Error", "Please fill all address fields", "error");
    }

    const orderItems = cartItems.map((i) => ({
      productId: i.product._id,
      quantity: i.quantity,
      size: i.size || "",
      image: i.product?.images?.[0] || "", // optional
    }));

    const payload = {
      orderItems,
      shippingAddress: {
        name: form.name,
        street: form.address,
        city: form.city,
        pincode: form.pincode,
        phone: form.mobile,
        state: "India"
      },
      paymentMethod: method === "online" ? "online" : "COD",
      totalPrice: total,
      shippingPrice: 0,
      itemsPrice: total,
    };

    try {
      setLoading(true);
      const res = await placeOrder(payload);

      if (res.data.success) {
        Swal.fire("Order Confirmed", "Your order has been placed", "success");
        await clearCartBackend(); // optional: clear from DB also
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order Error:", err);
      Swal.fire("Order Failed ", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // ✅ CLEAR CART UI ONLY (backend still keeps DB)
  // -------------------------
  const handleClear = async () => {
    try {
      setLoading(true);
      const data = await clearCartBackend();
      if (data.success) {
        Swal.fire("Cart Cleared", "Your cart is empty now", "success");
        navigate("/shop");
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Placeholder Razorpay
  // -------------------------
  const initRazorpayOrder = async () => {
    await handlePlaceOrder("online");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative">

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-[2000]">
          <Loader2 className="animate-spin w-8 h-8 mb-3" />
          <p className="font-bold text-xs sm:text-sm uppercase tracking-wide">Processing, please wait...</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Billing Form */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <FaShoppingCart /> Billing Details
          </h2>

          <div>
            <Label>Full Name *</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <Label>Mobile *</Label>
            <Input name="mobile" value={form.mobile} onChange={handleChange} required />
          </div>

          <div>
            <Label>Address *</Label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 h-24"
            />
          </div>

          <div>
            <Label>City *</Label>
            <Input name="city" value={form.city} onChange={handleChange} required />
          </div>

          <div>
            <Label>Pincode *</Label>
            <Input name="pincode" value={form.pincode} onChange={handleChange} required />
          </div>

          {/* Payment Selection */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-bold text-gray-600 uppercase">Payment Method:</p>
            <div className="flex gap-4">

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={form.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                COD
              </label>

              {/*<label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={form.paymentMethod === "online"}
                  onChange={handleChange}
                />
                Online
              </label>*/}

            </div>
          </div>

          {/* Buttons */}
          {form.paymentMethod === "COD" && (
            <Button onClick={() => handlePlaceOrder("COD")} className="w-full">
              Place Order (COD)
            </Button>
          )}

          {/* form.paymentMethod === "online" && (
            <Button onClick={initRazorpayOrder} className="w-full bg-orange-500 text-white">
              Pay via Razorpay →
            </Button>
          ) */}

          {/* cartItems.length > 0 && (
            <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded-full text-xs sm:text-sm">
              <FaTrash /> Clear Cart
            </button>
          ) */}

        </div>

        {/* Order Summary */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-20">
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <FaCreditCard /> Order Summary
          </h3>

          {cartItems.map((i) => (
            <div key={i.product._id} className="flex justify-between border-b pb-2 mb-2 text-sm">
              <span>{i.product.name} × {i.quantity}</span>
              <span className="font-bold">₹{(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}

          <article className="flex justify-between font-extrabold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </article>

        </div>
      </div>

    </section>
  );
};

export default Checkout;
