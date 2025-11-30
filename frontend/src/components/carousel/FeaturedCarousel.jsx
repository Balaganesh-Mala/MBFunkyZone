import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

import ProductCard from "../ui/ProductCard";
import api from "../../api/axios.js"; // ✅ axios instance using env

const FeaturedCarousel = () => {
  const [products, setProducts] = useState([]); // ✅ API products
  const [loading, setLoading] = useState(true);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products"); // ✅ fetch all products
      if (Array.isArray(res.data.products)) {
        // ✅ filter featured from API instead of dummy data
        const featured = res.data.products.filter((p) => p.isFeatured === true);
        setProducts(featured);
      }
    } catch (err) {
      console.error("Featured Product Fetch Error:", err);
      Swal.fire("Error", "Failed to load featured products ❗", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
        Featured Products
      </h2>

      {/* ✅ Loader UI untouched */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="max-w-[1300px] mx-auto">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              480: { slidesPerView: 2.3 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 4.5 },
              1280: { slidesPerView: 5 },
            }}
          >
            {/* ✅ API products mapped */}
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {" "}
                  {/* ✅ Navigation added */}
                  <ProductCard
                    product={{
                      ...product,
                      image: product.images?.[0], // optional: pass first image separately if your card uses `product.image`
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* If no Featured products */}
          {!products.length && (
            <p className="text-center text-sm text-gray-500 py-6">
              No Featured Products Found ❗
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedCarousel;
