import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaStar,
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { PiRepeatLight } from "react-icons/pi";
import { shopProducts } from "../data/dummyShopProducts";
import ProductCard from "../components/ui/ProductCard";
import { getProductById } from "../utils/getProductById";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(id);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(product?.images?.[0]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState("description");
  const [review, setReview] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const stars = [1, 2, 3, 4, 5];

  const similarProducts = shopProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5); // show only 5 similar products

  // ✅ Save real viewed product (not writing all products)
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      const updated = [
        product.id,
        ...viewed.filter((v) => v !== product.id),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Product not found
      </div>
    );
  }
  // ✅ Find Similar products based on category, exclude current product
  

  return (
    <div className="w-full bg-white">
      {/* ✅ Back Button (Not changed layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
        >
          <FaArrowLeft /> Back to Shop
        </button>
      </div>

      {/* ✅ Main Section (layout preserved) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT → IMAGE GALLERY (UI not changed, only logic corrected) */}
        <div className="flex flex-col sm:flex-row lg:flex-row gap-4">
          {/* THUMBNAILS ✅ FIX 2 */}
          <div className="flex sm:flex-row lg:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImg(img)}
                className="w-[70px] sm:w-20 h-[70px] sm:h-20 object-cover rounded-xl border cursor-pointer hover:border-black transition"
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="flex-1">
            <img
              src={selectedImg}
              alt={product.name}
              className="w-full h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl border shadow-sm"
            />
          </div>
        </div>

        {/* RIGHT → PRODUCT INFO (UI preserved) */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>

            {/* Wishlist button */}
            <button
              onClick={() => setLiked(!liked)}
              className="text-gray-400 hover:text-red-500 text-xl transition"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          {/* PRICE & RATING BLOCK → layout not touched */}
          <div className="flex items-center flex-wrap gap-2 text-sm sm:text-lg">
            <p className="font-bold text-lg text-black">
              ₹{product.price.toLocaleString()}
            </p>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg">
              <FaStar /> {product.ratings}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              ({product.reviews.length} Reviews)
            </span>
          </div>

          <hr className="border-gray-200" />

          {/* Description text (UI preserved) */}
          <div className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            <p>{product.description}</p>

            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-600">
              <li>Premium Material</li>
              <li>Lightweight & Durable</li>
              <li>Suitable for Office & Travel</li>
              <li>Stylish Modern Look</li>
            </ul>
          </div>

          {/* Size Selector */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">
              Select Size:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                ...(product.sizes?.shirt || []),
                ...(product.sizes?.pant || []),
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                    size === s
                      ? "bg-black text-white border-black"
                      : "text-gray-800 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY + CART BUTTON ✅ FIX 3 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 border w-fit px-4 py-2 rounded-full bg-gray-50">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-sm"
              >
                −
              </button>
              <span className="text-xs sm:text-sm min-w-[20px] text-center">
                {qty}
              </span>
              <button onClick={() => setQty((q) => q + 1)} className="text-sm">
                +
              </button>
            </div>

            {/* Add to Cart Button (UI not touched, only send qty) */}
            <button
              onClick={() => {
                addToCart({ ...product, qty }); // ✅ sends quantity properly
                Swal.fire({
                  icon: "success",
                  title: "Added to Cart",
                  text: `${product.name} added successfully ✅`,
                  showConfirmButton: false,
                  timer: 1500,
                  toast: true,
                  position: "top-end",
                });
              }}
              className="flex items-center justify-center gap-2 flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition text-xs sm:text-sm"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Buy Now */}
          <button className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:border-black transition text-gray-900 text-xs sm:text-sm">
            Buy Now
          </button>

          {/* Extra bottom Icons (UI preserved) */}
          <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
            <p className="flex items-center gap-2">
              <TbTruckDelivery /> Free Delivery Available
            </p>
            <p className="flex items-center gap-2">
              <PiRepeatLight /> 7-Day Easy Replacement
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
            Similar Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ✅ Footer you already did remains here — not removed */}
    </div>
  );
};

export default ProductDetails;
