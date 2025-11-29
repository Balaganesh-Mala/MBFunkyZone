import React from "react";
import { shopProducts as newArrivalProducts } from "../../data/dummyShopProducts";
import ProductCard from "../ui/ProductCard";

import { FaAngleRight } from "react-icons/fa6";


const NewArrivals = () => {
  return (
    <div className="bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 ">
        <div className="mb-5 flex justify-between">
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl text-gray-900">New Arrivals</h2>
            <p className="text-gray-600">
              Add some content in this place later on we can add the related
              content to this page.
            </p>
          </div>
          <button className="mt-3 bg-black text-white px-6 py-2 text-xs sm:text-sm rounded-full hover:bg-gray-800 transition font-semibold flex items-center gap-3 justify-center">View all <FaAngleRight/></button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {newArrivalProducts.slice(0,10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
