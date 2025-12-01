import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import CategoryCard from "../ui/CategoryCard";
import api from "../../api/axios.js"; // ✅ axios instance using env

const CategorySection = () => {
  const [categories, setCategories] = useState([]); // ✅ real categories
  const [loading, setLoading] = useState(true); // ✅ start with loader

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        console.log("Full API response:", res.data);

        // ✅ Fix: Correct data mapping
        if (res.data.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories);
        } else {
          setCategories([]);
          Swal.fire("Error", "Invalid API data ❗", "error");
        }
      } catch (err) {
        console.error("Category Fetch Error:", err);
        Swal.fire("Error", "Failed to load categories ❗", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold text-center text-gray-900">
        View Our Range Of Categories
      </h2>
      <p className="text-center text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
        Explore our wide collection of fresh, healthy and premium snack options.
        Choose your favorite category and discover delicious treats.
      </p>

      {/* ✅ Loader UI untouched */}
      {loading && (
        <div className="flex justify-center mt-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      {/* ✅ Keep existing 3-column UI but fix image paths */}
      {!loading && categories.length >= 4 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {/* LEFT TALL ✅ fixed */}
          <Link
            to={`/category-products?category=${categories[0]._id}`}
            className="bg-gray-200 rounded-xl overflow-hidden relative group row-span-2 h-[340px]"
          >
            <img
              src={categories[0].image.url} // ✅ FIXED
              alt={categories[0].name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-3 left-3 text-white">
              <p>
                {categories[0].name}
              </p>
              <p>{categories[0].description}</p>
            </div>
          </Link>

          {/* CENTER TOP ✅ fixed */}
          <Link
            to={`/category-products?category=${categories[1]._id}`}

            className="bg-gray-200 rounded-xl overflow-hidden relative group h-[160px]"
          >
            <img
              src={categories[1].image.url} // ✅ FIXED
              alt={categories[1].name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-3 left-3 text-white">
              <p>
                {categories[1].name}
              </p>
              <p>{categories[1].description}</p>
            </div>
          </Link>

          {/* RIGHT TALL ✅ fixed */}
          <Link
            to={`/category-products?category=${categories[3]._id}`}

            className="bg-gray-200 rounded-xl overflow-hidden relative group row-span-2 h-[340px]"
          >
            <img
              src={categories[3].image.url} // ✅ FIXED
              alt={categories[3].name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-3 left-3 text-white">
              <p>
                {categories[3].name}
              </p>
              <p>{categories[3].description}</p>
            </div>
          </Link>

          {/* CENTER BOTTOM ✅ fixed */}
          <Link
            to={`/category-products?category=${categories[0]._id}`}
            className="bg-gray-200 rounded-xl overflow-hidden relative group h-[160px]"
          >
            <img
              src={categories[2].image.url} // ✅ FIXED
              alt={categories[2].name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-3 left-3 text-white">
              <p>
                {categories[2].name}
              </p>
              <p>{categories[2].description}</p>
            </div>
          </Link>
        </div>
      )}

      {/* ✅ Remaining categories grid (after 4) unchanged UI */}
      {!loading && (
        <div className="px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.slice(4).map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
