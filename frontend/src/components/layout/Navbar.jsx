import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaSearch, FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import Logo from "../../assets/images/logo.jpg"

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Overlay for sidebar */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        ></div>
      )}

      <nav className="w-full bg-white shadow-sm border-b z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <img
              src={Logo || "https://dummyimage.com/40x40/000/ffffff&text=MB"}
              alt="Logo"
              className="h-10 w-10 rounded-lg object-cover border"
            />
            
          </div>

          {/* Nav links */}
          <ul className="hidden lg:flex gap-8 text-gray-700 text-sm font-semibold">
            <li><Link to="/" className="hover:text-black">HOME</Link></li>
            <li><Link to="/shop" className="hover:text-black">SHOP</Link></li>
            <li><Link to="/about" className="hover:text-black">ABOUT</Link></li>
            <li><Link to="/contact" className="hover:text-black">CONTACT</Link></li>
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-full w-[180px] md:w-[240px]">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-xs sm:text-sm w-full"
              />
            </div>

            {/* User */}
            <FaUserCircle
              onClick={() => navigate("/login")}
              className="text-xl sm:text-2xl text-gray-600 hover:text-black transition cursor-pointer"
            />

            {/* Cart */}
            <div onClick={() => setMobileMenuOpen(false)} className="relative cursor-pointer">
              <FaShoppingCart
                onClick={() => navigate("/cart")}
                className="text-xl sm:text-2xl text-gray-600 hover:text-black transition"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                {cartItems.length}
              </span>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-2xl text-gray-800 lg:hidden"
            >☰</button>
          </div>

        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-[260px] sm:w-[320px] bg-white shadow-xl z-50 p-5 flex flex-col transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="font-extrabold text-lg text-gray-900">Menu</h3>
          <FaTimes
            onClick={() => setMobileMenuOpen(false)}
            className="cursor-pointer text-xl text-gray-600 hover:text-red-500"
          />
        </div>

        {/* Mobile Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full mb-4 sm:hidden">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-xs w-full"
          />
        </div>

        {/* Sidebar Links */}
        <ul className="flex flex-col gap-4 text-gray-800 text-xs sm:text-sm font-semibold">
          <li onClick={() => setMobileMenuOpen(false)}>
            <Link to="/" className="hover:text-black">Home</Link>
          </li>
          <li onClick={() => setMobileMenuOpen(false)}>
            <Link to="/shop" className="hover:text-black">Shop</Link>
          </li>
          <li onClick={() => setMobileMenuOpen(false)}>
            <Link to="/about" className="hover:text-black">About</Link>
          </li>
          <li onClick={() => setMobileMenuOpen(false)}>
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </li>
          <li onClick={() => setMobileMenuOpen(false)}>
            <Link to="/cart" className="hover:text-black flex items-center gap-2">
              <FaShoppingCart/> Cart ({cartItems.length})
            </Link>
          </li>
        </ul>

        {/* Extra Sidebar Content */}
        <div className="mt-auto border-t pt-4 text-gray-500 text-[10px] sm:text-xs">
          <p>✔ Free Delivery</p>
          <p>✔ 7-day Replacement</p>
          <p>✔ 100% Quality Assured</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
