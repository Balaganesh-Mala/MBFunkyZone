import React, { useState, useMemo } from "react";
import ShopFilters from "../components/sections/ShopFilters";
import ProductCard from "../components/ui/ProductCard";
import { shopProducts } from "../data/dummyShopProducts";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [rating, setRating] = useState("");

  const filteredProducts = useMemo(() => {
    let products = [...shopProducts];

    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    if (rating) {
      products = products.filter(p => p.rating >= Number(rating));
    }

    if (sort === "low-high") {
      products.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      products.sort((a, b) => b.price - a.price);
    }

    if (sort === "top-rated") {
      products.sort((a, b) => b.rating - a.rating);
    }

    return products;
  }, [search, category, sort, rating]);

  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">

      {/* Filters */}
      <ShopFilters
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        sort={sort} setSort={setSort}
        rating={rating} setRating={setRating}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};

export default Shop;
