import React from "react";
import HeroCarousel from "../components/carousel/HeroCarousel";
import CategoriesGrid from "../components/sections/CategoriesGrid";
import NewArrivals from "../components/sections/NewArrivals";
import FeaturedCarousel from "../components/carousel/FeaturedCarousel";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <CategoriesGrid/>
      <NewArrivals/>
      <FeaturedCarousel/>
    </div>
  );
};

export default Home;
