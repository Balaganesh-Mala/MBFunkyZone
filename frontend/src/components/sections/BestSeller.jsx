import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import ProductCard from "../ui/ProductCard";
import api from "../../api/axios.js"; // ✅ from VITE_API_BASE_URL

const BestSeller = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBestSeller = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const all = res.data.products || [];

      // ✅ Filter Best Sellers
      const bestSellerList = all.filter((p) => p.isBestSeller === true);
      setProducts(bestSellerList);
      console.log("Best sellers:", bestSellerList);
    } catch (err) {
      console.error("BestSeller fetch:", err);
      Swal.fire("Error", "Failed to load best sellers ❗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBestSeller();
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center items-center py-14 bg-gray-50">
        <Loader2 className="w-7 h-7 animate-spin" />
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t">
      <div className="mb-5 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Best Seller Products
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Most popular products loved by our customers 🔥
          </p>
        </div>

        <button
          onClick={() => navigate("/shop")}
          className="bg-black text-white px-6 py-2 text-xs sm:text-sm rounded-full hover:bg-gray-800 transition font-semibold"
        >
          View All →
        </button>
      </div>

      {/* ✅ Mapping real best seller products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} /> // ✅ Uses Mongo _id
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
