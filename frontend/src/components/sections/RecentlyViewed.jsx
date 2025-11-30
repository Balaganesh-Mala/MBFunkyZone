import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import ProductCard from "../ui/ProductCard";
import api from "../../api/axios.js"; // ✅ axios instance using VITE_API_BASE_URL

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]); // ✅ real products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products"); // ✅ fetch all products
        const allProducts = res.data.products || [];

        const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        // ✅ match with _id from API products
        const list = viewed
          .map((id) => allProducts.find((p) => p._id === id))
          .filter(Boolean)
          .slice(0, 5); // only 5

        setProducts(list);
      } catch (err) {
        console.error("Recently viewed fetch:", err);
        Swal.fire("Error", "Failed to load recently viewed products ❗", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10 bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
        Recently Viewed Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-5">
        {products.map((p) => (
          <div key={p._id} className="w-full">
            {/* ✅ product._id used properly */}
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
