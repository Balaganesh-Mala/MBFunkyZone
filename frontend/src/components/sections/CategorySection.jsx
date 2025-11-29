import { Link } from "react-router-dom";

import { categories } from "../../data/dummyCategories";
import CategoryCard from "../ui/CategoryCard";

import leftTall from "../../assets/images/image1.jpg";
import leftTall2 from "../../assets/images/image2.jpg";
import leftTall3 from "../../assets/images/image3.jpg";
import leftTall4 from "../../assets/images/image5.jpg";

const CategorySection = () => {
  const categoriesList = [
    {
      name: "Snacks & Namkeen",
      image: `${leftTall}`,
      link: "/products?category=snacks",
      size: "row-span-2 h-[340px]",
    },
    {
      name: "Dry Fruits",
      image: `${leftTall2}`,
      link: "/products?category=dry-fruits",
      size: "h-[160px]",
    },
    {
      name: "Healthy Trail Mix",
      image: `${leftTall4}`,
      link: "/products?category=healthy-mix",
      size: "h-[160px]",
    },
    {
      name: "Makhana",
      image: `${leftTall3}`,
      link: "/products?category=makhana",
      size: "row-span-2 h-[340px]",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold text-center text-gray-900">
        View Our Range Of Categories
      </h2>
      <p className="text-center text-gray-600 mt-2 text-sm max-w-2xl mx-auto">
        Explore our wide collection of fresh, healthy and premium snack options.
        Choose your favorite category and discover delicious treats.
      </p>

      {/* 3 COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
        {/* LEFT TALL */}
        <Link
          to={categories[0].link}
          className={`bg-gray-200 rounded-xl overflow-hidden relative group ${categoriesList[0].size}`}
        >
          <img
            src={categories[0].image}
            alt={categories[0].name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <p className="absolute bottom-3 left-3 text-white text-lg font-medium">
            {categories[0].name}
          </p>
        </Link>

        {/* CENTER TOP */}
        <Link
          to={categories[1].link}
          className={`bg-gray-200 rounded-xl overflow-hidden relative group ${categoriesList[1].size}`}
        >
          <img
            src={categories[1].image}
            alt={categories[1].name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <p className="absolute bottom-3 left-3 text-white">
            {categories[1].name}
          </p>
        </Link>

        {/* RIGHT TALL (NOW FULL HEIGHT) */}
        <Link
          to={categories[3].link}
          className={`bg-gray-200 rounded-xl overflow-hidden relative group ${categoriesList[3].size}`}
        >
          <img
            src={categories[3].image}
            alt={categories[3].name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <p className="absolute bottom-3 left-3 text-white text-lg font-medium">
            {categories[3].name}
          </p>
        </Link>

        {/* CENTER BOTTOM */}
        <Link
          to={categories[2].link}
          className={`bg-gray-200 rounded-xl overflow-hidden relative group ${categoriesList[2].size}`}
        >
          <img
            src={categories[2].image}
            alt={categories[2].name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <p className="absolute bottom-3 left-3 text-white">
            {categories[2].name}
          </p>
        </Link>
      </div>
      <div className="px-6 py-10 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.slice(4).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
