import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { shopProducts} from "../../data/dummyShopProducts";
import ProductCard from "../ui/ProductCard";

const FeaturedCarousel = () => {
  const featuredProducts = shopProducts.filter(p => p.isFeatured === true);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
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
            480: { slidesPerView: 2.3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4.5 },
            1280: { slidesPerView: 5}
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
