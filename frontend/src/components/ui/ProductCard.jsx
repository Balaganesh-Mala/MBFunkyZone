import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaTag } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // ✅ Discount Calculation
  const discountAmount =
    product.mrp > product.price ? product.mrp - product.price : 0;
  const discountPercent = discountAmount
    ? Math.round((discountAmount / product.mrp) * 100)
    : 0;
  const discountLabel = discountPercent ? `${discountPercent}% OFF` : "";

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer flex flex-col w-full sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] mx-auto border relative"
    >
      {discountLabel && (
        <div className="absolute top-2 left-2 bg-black text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
          <FaTag /> {discountLabel}
        </div>
      )}

      <div className="relative w-full h-[150px] sm:h-[160px] md:h-[170px] lg:h-[180px] bg-gray-100 overflow-hidden">
        {/* First Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
        />
        <img
          src={product.images[1]}
          alt={`${product.name} preview`}
          className="absolute w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105"
        />
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-black transition line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-orange-500 text-[10px] sm:text-xs mt-1 font-semibold">
            <FaStar /> {product.rating}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-base sm:text-lg font-bold text-black">
              ₹{product.price.toLocaleString()}
            </p>

            {discountAmount > 0 && (
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                ₹{product.mrp.toLocaleString()}
              </p>
            )}
          </div>

          {discountAmount > 0 && (
            <p className="flex items-center gap-1 mt-1 text-green-600 font-bold text-[9px] sm:text-[11px]">
              <FaTag /> You save ₹{discountAmount.toLocaleString()}!
            </p>
          )}
        </div>

        <button className="w-full bg-black text-white py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs lg:text-sm hover:bg-gray-800 transition mt-3">
          {" "}
          Buy Now{" "}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
