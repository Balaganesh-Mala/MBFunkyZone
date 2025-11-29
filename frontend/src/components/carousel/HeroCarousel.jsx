import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { heroSlides } from "../../data/dummyHeroSlides";

const HeroCarousel = () => {
  return (
    <section className="w-full mt-2">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="l shadow-lg"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.subtitle}
                className="w-full h-[450px] object-cover"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center space-y-4">
                <h4 className="text-lg md:text-xl text-white uppercase tracking-widest">
                  {slide.title}
                </h4>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                  {slide.subtitle}
                </h1>
                <button className="bg-white text-black px-6 py-3 font-semibold rounded-full hover:bg-gray-200 transition">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
