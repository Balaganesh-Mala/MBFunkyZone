import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import Button from "../components/ui/button.jsx";
import Label from "../components/ui/label.jsx";
import Input from "../components/ui/input.jsx"; // ✅ Missing Import FIXED
import api from "../api/axios.js";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (method) => {
    if (!cartItems.length) return;

    const orderItems = cartItems.map((i) => ({
      productId: i._id || i.id,
      quantity: i.qty,
      size: i.size || "M",
    }));

    const payload = {
      orderItems,
      shippingAddress: {
        name: form.name,
        street: form.address,
        city: form.city,
        state: "India",
        pincode: form.pincode,
        phone: form.mobile,
      },
      paymentMethod: method,
      totalPrice: total,
    };

    try {
      setLoading(true);

      const res = await api.post("/orders", payload);

      if (res.data.success) {
        Swal.fire("Order Confirmed ✅", "Your order has been placed", "success");
        clearCart();
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order Error:", err);
      Swal.fire(
        "Error ❌",
        err.response?.data?.message || "Order failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const initRazorpayOrder = async () => {
    if (
      !form.name ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      return Swal.fire("Error ❗", "Fill all address fields", "warning");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/payments/create-order", {
        amount: total * 100,
        currency: "INR",
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_yourKey",
        amount: data.amount,
        order_id: data.id,
        name: "Purchase Payment",
        description: "E-commerce Order",
        prefill: { name: form.name, contact: form.mobile },

        handler: async () => {
          try {
            Swal.fire("Payment Verified ✅", "Processing order...", "success");
            await placeOrder("Razorpay");
          } catch {
            Swal.fire(
              "Verify Error ❌",
              "Payment verification failed",
              "error"
            );
          }
        },

        theme: { color: "#000" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay Init Error:", err);
      Swal.fire("Error ❌", "Failed to open Razorpay", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-[2000]">
          <Loader2 className="animate-spin w-8 h-8 mb-3 text-black" />
          <p className="font-bold text-xs sm:text-sm text-black uppercase tracking-wide">
            Processing, Please wait...
          </p>
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
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Mobile *</Label>
            <Input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
            />
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
            <Input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Pincode *</Label>
            <Input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment Selection */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-bold text-gray-600 uppercase">
              Payment Method:
            </p>

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

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={form.paymentMethod === "Razorpay"}
                  onChange={handleChange}
                />
                Razorpay
              </label>
            </div>
          </div>

          {form.paymentMethod === "COD" && (
            <Button onClick={() => placeOrder("COD")} className="w-full">
              Place Order (COD)
            </Button>
          )}

          {form.paymentMethod === "Razorpay" && (
            <Button
              onClick={initRazorpayOrder}
              className="w-full bg-orange-500 text-white"
            >
              Pay via Razorpay →
            </Button>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 sticky top-20">
          <h3 className="text-xl font-extrabold flex items-center gap-2">
            <FaCreditCard />
            Order Summary
          </h3>

          {cartItems.map((i) => (
            <div
              key={i._id || i.id}
              className="flex justify-between border-b pb-2 mb-2 text-sm"
            >
              <span>
                {i.name} × {i.qty}
              </span>
              <span className="font-bold">
                ₹{(i.price * i.qty).toLocaleString()}
              </span>
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
