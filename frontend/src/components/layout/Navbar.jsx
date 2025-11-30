import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

import { Loader2 } from "lucide-react";
import api from "../../api/axios.js"; // axios instance using env

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [logo, setLogo] = useState(""); // ✅ real logo from settings API
  const [loading, setLoading] = useState(false);

  // ✅ Check token login (not changed)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLogged(!!token);
  }, []);

  // ✅ Load settings logo
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/settings/public"); // we will fix endpoint below if needed
        setLogo(res.data.settings?.logo?.url || "");
        console.log("Settings:", res.data);
      } catch (err) {
        console.error("Settings Logo Error:", err);
        Swal.fire("Error", "Failed to load site logo ❗", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return !!res.data.success;
    } catch {
      return false;
    }
  };

  const handleAvatarClick = async () => {
    const valid = await verifyUser();

    if (valid) navigate("/profile");
    else {
      Swal.fire("Login Required", "Please login to view profile ❗", "info");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        ></div>
      )}

      <nav className="w-full bg-white shadow-sm border-b z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo from settings API ✅ */}
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <img
                src={logo || "/logo.jpg"}
                alt="Logo"
                className="h-10 w-10 rounded-lg object-cover border"
              />
            )}
          </div>

          <ul className="hidden lg:flex gap-8 text-gray-700 text-sm font-semibold">
            <li><Link to="/" className="hover:text-black">HOME</Link></li>
            <li><Link to="/shop" className="hover:text-black">SHOP</Link></li>
            <li><Link to="/orders" className="hover:text-black">ORDERS</Link></li>
            <li><Link to="/about" className="hover:text-black">ABOUT</Link></li>
            <li><Link to="/contact" className="hover:text-black">CONTACT</Link></li>
          </ul>

          <div className="flex items-center gap-5">

            {/* User Avatar */}
            <button onClick={handleAvatarClick}>
              <FaUserCircle className="text-xl sm:text-2xl text-gray-600 hover:text-black transition" />
            </button>

            {/* Cart */}
            <div className="relative">
              <FaShoppingCart
                onClick={() => navigate("/cart")}
                className="text-xl sm:text-2xl text-gray-600 hover:text-black transition"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            </div>

            <button onClick={() => setMobileMenuOpen(true)} className="text-2xl lg:hidden">☰</button>
          </div>

        </div>
      </nav>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-[260px] sm:w-[320px] bg-white shadow-xl z-50 p-5 flex flex-col transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="font-extrabold text-lg text-gray-900">Menu</h3>
          <FaTimes onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-600 hover:text-red-500 transition cursor-pointer" />
        </div>

        <ul className="flex flex-col gap-4 font-semibold text-sm text-gray-800">
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/">Home</Link></li>
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/shop">Shop</Link></li>
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/orders">Orders</Link></li>
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/about">About</Link></li>
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/contact">Contact</Link></li>
          <li onClick={()=>setMobileMenuOpen(false)}><Link to="/cart">Cart ({cartItems.length})</Link></li>
        </ul>

        <div className="mt-auto border-t pt-4 text-gray-500 text-xs space-y-1">
          <p>✔ Free Delivery</p>
          <p>✔ 7-day Replacement</p>
          <p>✔ 100% Quality Assured</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
