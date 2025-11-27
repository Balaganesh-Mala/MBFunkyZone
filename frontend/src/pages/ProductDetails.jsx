import React, { useState, useMemo } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  FaStar,
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { PiRepeatLight } from "react-icons/pi";

import ProductCard from "../components/ui/ProductCard";
import { getProductById } from "../utils/getProductById";
import { similarProducts } from "../data/dummySimilarProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(product?.image);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [liked, setLiked] = useState(false);
  const [review, setReview] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const stars = [1, 2, 3, 4, 5];

  const relatedSimilar = useMemo(() => {
    return similarProducts.slice(0, 10);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-sm">
        Product not found
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back to Shop
        </button>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-6">
        {/* Image Gallery Section */}
        <div className="flex flex-col sm:flex-row lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-row lg:flex-col gap-3 justify-start overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {[
              product.image,
              ...relatedSimilar.slice(0, 3).map((p) => p.image),
            ].map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImg(img)}
                className="w-20 h-20 object-cover rounded-xl border cursor-pointer hover:border-black transition"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={selectedImg}
              alt={product.name}
              className="w-full h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl border shadow-sm"
            />
          </div>
        </div>

        {/* Product Content Section */}
        <div className="space-y-4 w-full">
          {/* Title and Wishlist */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>
            <button
              onClick={() => setLiked(!liked)}
              className="text-gray-400 hover:text-red-500 text-xl transition"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Price */}
            <p className="text-1xl sm:text-2xl  text-black">
              ₹{product.price.toLocaleString()} |
            </p>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-orange-500 text-2xl sm:text-xl font-semibold">
                <FaStar /> {product.rating}
              </div>
              <span className="text-xs text-gray-500">
                ({Math.floor(Math.random() * 50) + 10} Reviews)
              </span>
            </div>
          </div>
          <hr />

          <div className="pt-0 text-gray-700 text-sm leading-relaxed">
            <p>
              Order process the same day and delivery to your place within 1-3
              working days in Tamil Nadu ( author states get delivery within 3-5
              working days)
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Premium Material</li>
              <li>Lightweight & Durable</li>
              <li>Suitable for Daily, Office, Travel Use</li>
              <li>Stylish Modern Design</li>
            </ul>
          </div>
          {/* Size Selector */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase">
              Select Size:
            </p>
            <div className="flex gap-2 flex-wrap">
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition ${
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
          {/* Buttons */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-5 border w-fit px-3 py-3 rounded-full bg-gray-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-sm"
                >
                  −
                </button>
                <span className="text-sm min-w-[20px] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="text-sm"
                >
                  +
                </button>
              </div>
              <button className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm">
                <FaShoppingCart /> Add to Cart
              </button>
            </div>

            <button className="w-full border border-gray-300 py-4 rounded-full font-semibold hover:border-black transition text-gray-900 text-sm">
              Buy Now
            </button>
          </div>

          {/* Extra Info */}
          <div className="text-xs text-gray-500 border-t pt-3 space-y-1 ">
            <p className="flex items-center gap-2">
              <TbTruckDelivery /> Free Delivery Available
            </p>

            <p className="flex items-center gap-2">
              <PiRepeatLight /> 7-Day Easy Replacement
            </p>
          </div>
        </div>
      </div>

      {/* Description / Reviews Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 border-b pb-2 text-sm font-semibold text-gray-500">
          <button
            onClick={() => setTab("description")}
            className={
              tab === "description"
                ? "text-black border-b-2 border-black pb-1"
                : ""
            }
          >
            Description
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={
              tab === "reviews" ? "text-black border-b-2 border-black pb-1" : ""
            }
          >
            Reviews
          </button>
        </div>

        {tab === "description" && (
          <div className="pt-4 text-gray-700 text-sm leading-relaxed">
            <ul className="list-disc pl-5 space-y-1">
              <li>Premium Material</li>
              <li>Lightweight & Durable</li>
              <li>Suitable for Daily, Office, Travel Use</li>
              <li>Stylish Modern Design</li>
            </ul>
          </div>
        )}

        {tab === "reviews" && (
          <div className="pt-4 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 border p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">Customer {i}</p>
                  <div className="flex text-orange-400 text-xs">
                    {stars.map((s) => (
                      <FaStar key={s} />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Great quality! Really loved it.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <h3 className="font-extrabold text-xl mb-4">Post Your Review</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Your Name"
            value={review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
            className="bg-gray-100 px-4 py-2 rounded-full text-xs sm:text-sm border outline-none"
          />
          <input
            placeholder="Your Email"
            value={review.email}
            onChange={(e) => setReview({ ...review, email: e.target.value })}
            className="bg-gray-100 px-4 py-2 rounded-full text-xs sm:text-sm border outline-none"
          />
        </div>

        <textarea
          placeholder="Write Review..."
          value={review.message}
          onChange={(e) => setReview({ ...review, message: e.target.value })}
          className="w-full bg-gray-100 px-4 py-3 rounded-xl border outline-none text-xs sm:text-sm h-28"
        />

        {/* Star Rating */}
        <div className="flex gap-1 text-orange-400 my-2">
          {stars.map((s) => (
            <FaStar
              key={s}
              onClick={() => setReview({ ...review, rating: s })}
              className={`${
                review.rating >= s ? "text-orange-500" : "text-gray-300"
              } cursor-pointer text-lg`}
            />
          ))}
        </div>

        <button className="bg-black text-white px-6 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition">
          Post Review
        </button>
      </div>

      {/* Similar Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 pb-14">
        <h3 className="font-extrabold text-2xl mb-5">Similar Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {relatedSimilar.slice(0, 12).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
