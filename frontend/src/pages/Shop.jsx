import React, { useState, useMemo, useEffect } from "react";
import { shopProducts } from "../data/dummyShopProducts";
import ProductCard from "../components/ui/ProductCard";


const RecentlyViewedSection = () => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const products = viewed
      .map(id => shopProducts.find(p => p.id === id))
      .filter(Boolean);

    setViewedProducts(products);
  }, []);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 mb-4">
        Recently Viewed Products
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {viewedProducts.map(p => (
          <div key={p.id} className="min-w-[180px] sm:min-w-[200px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};
const Shop = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    shopProducts.forEach((product) => {
      if (!viewed.includes(product.id)) {
        const updated = [product.id, ...viewed].slice(0, 10);
        localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      }
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...shopProducts];

    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (rating) {
      products = products.filter((p) => p.rating >= Number(rating));
    }

    if (sort === "low-high") products.sort((a, b) => a.price - b.price);
    if (sort === "high-low") products.sort((a, b) => b.price - a.price);
    if (sort === "top-rated") products.sort((a, b) => b.rating - a.rating);

    return products;
  }, [search, category, sort, rating]);

  return (
    <div className="bg-white min-h-screen">
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
        {/* Sidebar Filters */}
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

            {["Casual", "Office", "College", "Travel"].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition ${
                    category === cat
                      ? "bg-black text-white border-black"
                      : "hover:border-black"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
          {/* Sort Filter */}
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
          {/* Header Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
              Our Collection Of Products
            </h1>

            {/* Search Bar */}
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <input
                placeholder="Search An Item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border bg-gray-100 px-4 py-2 rounded-full outline-none text-sm"
              />
            </div>
          </div>
          <div className="border-t py-4 text-start text-xs sm:text-sm text-gray-600">
            <p className="font-bold text-gray-900">
              Showing 1-{filteredProducts.length} Products
            </p>
            <p>
              Premim collection and quality prodcts here based on prodcts you
              can get some discout.{" "}
            </p>
          </div>
          <div className="pt-2">
            {/* Product Grid  */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 pb-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="border-t py-4 text-center text-xs sm:text-sm text-gray-600">
              <p>Showing 1-{filteredProducts.length} Products</p>
              <button className="mt-3 bg-black text-white px-6 py-2 text-xs sm:text-sm rounded-full hover:bg-gray-800 transition font-semibold">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
