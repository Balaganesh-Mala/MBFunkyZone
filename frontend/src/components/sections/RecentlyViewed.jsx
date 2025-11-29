import React, { useState, useEffect } from "react";
import { shopProducts } from "../../data/dummyShopProducts";
import ProductCard from "../ui/ProductCard";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // Find products based on real visits
    const viewedProducts = viewed
      .map((id) => shopProducts.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 5); // ✅ show only 5 recent items

    setProducts(viewedProducts);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
        Recently Viewed Products
      </h2>

      {/* Grid keeps responsive layout but cards limit 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-5">
        {products.map((p) => (
          <div key={p.id} className="w-full">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
