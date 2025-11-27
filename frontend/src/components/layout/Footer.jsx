import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 text-gray-700">

        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">MB Funky Zone</h3>
          <p className="text-sm leading-relaxed">
            Your one stop shop for all premium fashion bags and accessories.
            We deliver quality products built for your lifestyle.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-black transition cursor-pointer">Home</a></li>
            <li><a className="hover:text-black transition cursor-pointer">Shop</a></li>
            <li><a className="hover:text-black transition cursor-pointer">About</a></li>
            <li><a className="hover:text-black transition cursor-pointer">Contact</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-black transition cursor-pointer">Casual Bags</a></li>
            <li><a className="hover:text-black transition cursor-pointer">Office Bags</a></li>
            <li><a className="hover:text-black transition cursor-pointer">Travel Bags</a></li>
            <li><a className="hover:text-black transition cursor-pointer">College Bags</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <FaFacebook className="hover:text-black cursor-pointer transition" />
            <FaInstagram className="hover:text-black cursor-pointer transition" />
            <FaTwitter className="hover:text-black cursor-pointer transition" />
            <FaLinkedin className="hover:text-black cursor-pointer transition" />
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-500 border-t py-4">
        © 2025 MB Funky Zone. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
