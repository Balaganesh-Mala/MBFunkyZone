import React from "react";
import { newArrivalProducts } from "../../data/dummyProducts";
import ProductCard from "../ui/ProductCard";

const NewArrivals = () => {
  return (
    <section className="px-6 py-10 bg-gray-50">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        New Arrivals
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {newArrivalProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
