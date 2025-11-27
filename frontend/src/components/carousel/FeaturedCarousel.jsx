import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { featuredProducts } from "../../data/dummyProducts";
import ProductCard from "../ui/ProductCard";

const FeaturedCarousel = () => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        Featured Products
      </h2>

      <div className="max-w-[1300px] mx-auto">
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            480: { slidesPerView: 1.3 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 }
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
