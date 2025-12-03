import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js"; // Axios instance using env

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [rating, setRating] = useState("");
  const [visible, setVisible] = useState(12); // initially show 12

  const [products, setProducts] = useState([]); // API Products
  const [categories, setCategories] = useState([]); // API Categories
  const [loading, setLoading] = useState(false);

  // ✅ Load categories from DB
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    })();
  }, []);

  // ✅ Load products from DB
  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Product fetch error:", err);
      Swal.fire("Error", "Failed to fetch products ❗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ Filtering logic preserved
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      list = list.filter((p) => p.category?._id === category);
    }

    if (rating) {
      list = list.filter((p) => p.rating >= Number(rating));
    }

    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);
    if (sort === "top-rated") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, category, sort, rating, products]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
        {/* Sidebar Filter UI preserved ✔ */}
        <aside className="bg-gray-50 border shadow-sm rounded-xl p-4 lg:sticky lg:top-20 h-fit">
          <h2 className="font-bold text-sm sm:text-lg mb-3 uppercase text-gray-700">
            Categories
          </h2>
          <ul className="space-y-2">
            <button
              onClick={() => setCategory("")}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                category === ""
                  ? "bg-black text-white border-black"
                  : "hover:border-black"
              }`}
            >
              All Categories
            </button>

            {/* ✅ API Categories used in sidebar */}
            {categories.map((c) => (
              <li key={c._id}>
                <button
                  onClick={() => setCategory(c._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                    category === c._id
                      ? "bg-black text-white border-black"
                      : "hover:border-black"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Sort UI preserved ✔ */}
          <div className="mt-5 border-t pt-3">
            <h2 className="font-bold text-sm sm:text-lg mb-2 uppercase text-gray-700">
              Sort By
            </h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border bg-gray-100 px-4 py-2 rounded-full outline-none text-sm"
            >
              <option value="">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>
        </aside>

        <div>
          {/* Header UI preserved ✔ */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Our Collection Of Products
          </h1>

          {/* Search preserved ✔ */}
          <input
            placeholder="Search An Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border bg-gray-100 px-4 py-2 rounded-full outline-none text-sm mb-4"
          />

          <div className="border-t py-4 text-start text-xs sm:text-sm text-gray-600">
            <p className="font-bold text-gray-900">
              Showing 1-{filteredProducts.length} Products
            </p>
            <p>
              Premium collection and quality products here based on products you
              can get discount.
            </p>
          </div>

          {/* ✅ Product Grid updated to use API products */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 pb-6">
              {filteredProducts.slice(0, visible).map((p) => (
                <div key={p._id} onClick={() => navigate(`/product/${p._id}`)}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination preserved ✔ */}
          <div className="border-t py-4 text-center text-xs sm:text-sm text-gray-600">
            <p className="font-bold text-gray-900">
              Showing 1-{Math.min(visible, filteredProducts.length)} of{" "}
              {filteredProducts.length} Products
            </p>

            {visible < filteredProducts.length && (
              <button
                onClick={() => setVisible((prev) => prev + 12)}
                className="mt-3 bg-black text-white px-6 py-2 text-xs sm:text-sm rounded-full hover:bg-gray-800 transition font-semibold"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
