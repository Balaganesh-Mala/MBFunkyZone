import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    payment: "cod"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-8">

      {/* Back */}
      <button onClick={()=>navigate("/cart")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6">
        <FaArrowLeft/> Back to Cart
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT → FORM */}
        <div className="bg-white border shadow-sm rounded-2xl p-5 sm:p-6">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-900">Billing Details</h2>

          <div className="space-y-4">
            <input onChange={handleChange} name="name" placeholder="Full Name" className="w-full border bg-gray-100 px-4 py-3 rounded-full outline-none text-sm" />
            <input onChange={handleChange} name="mobile" placeholder="Mobile Number" className="w-full border bg-gray-100 px-4 py-3 rounded-full outline-none text-sm" />

            <textarea onChange={handleChange} name="address" placeholder="Delivery Address" className="w-full border bg-gray-100 px-4 py-3 rounded-2xl outline-none text-sm h-32" />

            <div className="grid grid-cols-2 gap-4">
              <input onChange={handleChange} name="city" placeholder="City" className="border bg-gray-100 px-4 py-3 rounded-full outline-none text-sm w-full" />
              <input onChange={handleChange} name="pincode" placeholder="Pin Code" className="border bg-gray-100 px-4 py-3 rounded-full outline-none text-sm w-full" />
            </div>

            {/* Payment */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase">Payment Method</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full cursor-pointer border hover:border-black transition">
                    <input type="radio" name="payment" value="cod" defaultChecked onChange={handleChange} /> Cash on Delivery
                </label>

                <label className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full cursor-pointer border hover:border-black transition">
                    <input type="radio" name="payment" value="card" onChange={handleChange} /> Credit/Debit Card
                </label>

                <label className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-full cursor-pointer border hover:border-black transition">
                    <input type="radio" name="payment" value="upi" onChange={handleChange} /> UPI
                </label>
              </div>
            </div>

            {/* Place Order */}
            <button className="mt-4 w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition text-sm">
              Place Order
            </button>

          </div>
        </div>

        {/* RIGHT → ORDER SUMMARY */}
        <div className="bg-white border shadow-sm rounded-2xl p-5 sm:p-6 h-fit sticky top-20">
          <h2 className="text-2xl font-extrabold mb-5 text-gray-900">Your Order</h2>

          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm border-b pb-2 mb-2">
              <span className="font-medium">{item.name} × {item.qty}</span>
              <span className="font-bold">₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}

          <div className="flex justify-between text-lg font-extrabold mt-4 border-t pt-3">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
