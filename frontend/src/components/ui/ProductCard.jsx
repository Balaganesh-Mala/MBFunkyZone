import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaTag, FaBookmark } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const discountAmount = product.mrp > product.price ? product.mrp - product.price : 0;
  const discountPercent = discountAmount ? Math.round((discountAmount / product.mrp) * 100) : 0;
  const discountLabel = discountPercent ? `${discountPercent}% OFF` : "";

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)} // ✅ FIXED
      className="group cursor-pointer bg-white border relative w-full sm:max-w-[220px] mx-auto rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      {discountLabel && (
        <span className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 rounded text-[10px] flex items-center gap-1">
          <FaTag /> {discountLabel}
        </span>
      )}

      {/* ✅ IMAGE FIX */}
      <div className="relative w-full h-[150px] sm:h-[170px] overflow-hidden bg-gray-100">
        {Array.isArray(product.images) && product.images.length >= 2 ? (
          <>
            <img
              src={product.images[0]} // ✅ API Cloudinary image
              alt={product.name}
              className="absolute w-full h-full object-cover opacity-100 transition-opacity duration-500 group-hover:opacity-0"
            />
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-100 group-hover:scale-105"
            />
          </>
        ) : (
          <FaBookmark className="text-gray-300 w-8 h-8 mx-auto mt-[60px]" />
        )}
      </div>

      {/* CONTENT (UI not touched) */}
      <article className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-black transition line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-orange-500 text-[10px] sm:text-xs mt-1 font-semibold">
            <FaStar /> {product.rating}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-base sm:text-lg font-bold text-black">₹{product.price.toLocaleString()}</p>
            {discountAmount > 0 && (
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">₹{product.mrp.toLocaleString()}</p>
            )}
          </div>

          {discountAmount > 0 && (
            <p className="flex items-center gap-1 mt-1 text-green-600 font-bold text-[9px] sm:text-[11px]">
              <FaTag /> You save ₹{discountAmount.toLocaleString()}!
            </p>
          )}
        </div>

        <button className="w-full bg-black text-white py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs hover:bg-gray-800 transition mt-3">
          Buy Now
        </button>
      </article>
    </div>
  );
};

export default ProductCard;
