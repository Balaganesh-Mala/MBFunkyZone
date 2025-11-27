import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-black transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 text-sm">
          <FaStar /> <span className="text-gray-600 text-xs">{product.rating}</span>
        </div>

        <p className="text-xl font-bold text-black">₹{product.price.toLocaleString()}</p>

        <button className="w-full bg-black text-white py-2 rounded-full text-xs hover:bg-gray-800 transition">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
