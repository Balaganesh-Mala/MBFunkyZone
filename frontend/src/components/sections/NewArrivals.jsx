import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { FaAngleRight } from "react-icons/fa6";

import ProductCard from "../ui/ProductCard";
import api from "../../api/axios.js"; // ✅ axios instance using env

const NewArrivals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // ✅ real API products
  const [loading, setLoading] = useState(true);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products"); // ✅ fetch from backend
      if (Array.isArray(res.data.products)) {
        // ✅ Sort latest using createdAt from DB
        const latest = res.data.products
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10); // only 10 new products

        setProducts(latest);
      } else {
        setProducts([]);
      }
      console.log("New arrivals:", products);
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Failed to load new arrival products ❗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewArrivals();
  }, []);

  return (
    <div className="bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-5 flex justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl text-gray-900">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-sm">
              Add some content in this place later on we can add the related content.
            </p>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-6 py-2 text-xs sm:text-sm rounded-full hover:bg-gray-800 transition font-semibold flex items-center gap-2"
          >
            View all <FaAngleRight />
          </button>
        </div>

        {/* ✅ Loader preserved */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* If no New Arrival products */}
        {!loading && !products.length && (
          <p className="text-center text-sm text-gray-500 py-5">
            No New Arrival Products Found ❗
          </p>
        )}
      </section>
    </div>
  );
};

export default NewArrivals;
