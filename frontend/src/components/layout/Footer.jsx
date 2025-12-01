import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Column 1 - Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              MB Funky Zone
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Your one-stop shop for premium fashion, bags, and accessories.
              Quality products made for your lifestyle — stylish, durable & affordable.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-black transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-black transition">Shop</Link></li>
              <li><Link to="/shop" className="hover:text-black transition">Categories</Link></li>
              <li><Link to="/about" className="hover:text-black transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-black transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3 - Customer Support (NO LINKS) */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Return / Refund Policy</li>
              <li>Shipping Information</li>
              <li>FAQ</li>
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <p className="text-sm text-gray-600 mb-4">
              Stay updated with our latest offers & collections.
            </p>
            <div className="flex space-x-4 text-xl text-gray-700">
              <FaFacebook className="hover:text-black cursor-pointer transition" />
              <FaInstagram className="hover:text-black cursor-pointer transition" />
              <FaTwitter className="hover:text-black cursor-pointer transition" />
              <FaLinkedin className="hover:text-black cursor-pointer transition" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 border-t py-4 bg-gray-100">
        © {new Date().getFullYear()} MB Funky Zone. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
