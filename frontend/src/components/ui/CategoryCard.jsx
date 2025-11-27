import React from "react";

const CategoryCard = ({ category }) => {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
      />
      <div className="p-3 text-center">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-black transition">
          {category.name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
