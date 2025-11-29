import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    payment: "cod", // default COD
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerRazorpay = () => {
    Swal.fire({
      icon: "info",
      title: "Redirecting to Razorpay…",
      text: "Please wait while we open the payment gateway",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    // Simulated payment success alert
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Payment Successful",
        text: `You paid ₹${total.toLocaleString()} via Razorpay `,
        confirmButtonColor: "#000",
      }).then(() => {
        clearCart(); // empty cart after successful payment
        navigate("/");
        Swal.fire({
          icon: "success",
          title: "Order Confirmed",
          text: "Your order has been placed successfully",
          timer: 1800,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      });
    }, 1700);
  };

  const placeOrderCOD = () => {
    clearCart();
    navigate("/");
    Swal.fire({
      icon: "success",
      title: "Order Placed",
      text: "Your COD order has been placed successfully",
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  };

  const handleOrder = () => {
    if (!form.name || !form.mobile || !form.address || !form.city || !form.pincode) {
      return Swal.fire({
        icon: "error",
        title: "Missing Details",
        text: "Please fill in all billing fields before placing order.",
        confirmButtonColor: "#000",
      });
    }

    if (form.payment === "cod") {
      placeOrderCOD();
    } else if (form.payment === "razorpay") {
      triggerRazorpay();
    }
  };

  return (
    <section className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT → BILLING FORM */}
        <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">

          {/* Header */}
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <FaShoppingCart /> Billing Details
          </h2>

          {/* Inputs */}
          <input
            name="name"
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full bg-gray-100 border px-4 py-2 rounded-full text-sm outline-none focus:border-black transition"
          />

          <input
            name="mobile"
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full bg-gray-100 border px-4 py-2 rounded-full text-sm outline-none focus:border-black transition"
          />

          <textarea
            name="address"
            onChange={handleChange}
            placeholder="Delivery Address"
            className="w-full bg-gray-100 border px-4 py-3 rounded-xl text-sm outline-none focus:border-black transition h-28"
          />

          <input
            name="city"
            onChange={handleChange}
            placeholder="City"
            className="w-full bg-gray-100 border px-4 py-2 rounded-full text-sm outline-none focus:border-black transition"
          />

          <input
            name="pincode"
            onChange={handleChange}
            placeholder="Pin Code"
            className="w-full bg-gray-100 border px-4 py-2 rounded-full text-sm outline-none focus:border-black transition"
          />

          {/* Payment Options */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Payment Method:</p>
            <div className="flex flex-wrap gap-3">

              <label className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer text-xs sm:text-sm font-semibold transition ${form.payment==="cod"?"bg-black text-white":"bg-gray-100 hover:border-black"}`}>
                <input type="radio" name="payment" value="cod" defaultChecked onChange={handleChange} hidden />
                <FaShoppingCart/> COD
              </label>

              <label className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer text-xs sm:text-sm font-semibold transition ${form.payment==="razorpay"?"bg-black text-white":"bg-gray-100 hover:border-black"}`}>
                <input type="radio" name="payment" value="razorpay" onChange={(e)=>setForm({...form,payment:"razorpay"})} hidden />
                <FaCreditCard/> Razorpay
              </label>

            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={handleOrder}
            className="w-full bg-black text-white py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-800 transition"
          >
            Place Order
          </button>

        </div>

        {/* RIGHT → ORDER SUMMARY */}
        <div className="bg-white border rounded-2xl shadow-sm p-5 sm:p-6 h-fit sticky top-20">

          {/* Header */}
          <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <FaCreditCard /> Order Summary
          </h3>

          {/* Items */}
          {cartItems.length === 0 && <p className="text-sm text-gray-500">No products added</p>}

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-xs sm:text-sm border-b pb-2 mb-3">
              <span>{item.name} × {item.qty}</span>
              <span className="font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between font-extrabold text-lg mt-3 border-t pt-3">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {/* Razorpay Button */}
          {form.payment === "razorpay" && (
            <button
              onClick={triggerRazorpay}
              className="w-full mt-5 bg-orange-500 text-white py-3 rounded-full font-semibold text-xs sm:text-sm hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <FaCreditCard /> Pay via Razorpay
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default Checkout;
