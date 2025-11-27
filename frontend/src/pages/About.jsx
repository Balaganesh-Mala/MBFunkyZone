import React from "react";
import { FaBullseye, FaUsers, FaHandshake, FaAward } from "react-icons/fa";
import Logo from "../assets/images/logo.jpg"

const About = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* TOP → Intro */}
        <div className="bg-white border shadow-sm rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">About the Company</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              This is a dummy About Us section. Replace with your client company details later.
              We are building this layout using MERN stack — frontend only for now.
              Our platform offers stylish and premium products with a seamless experience.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><FaAward className="text-orange-500"/> 100% Authentic Products</li>
              <li className="flex items-center gap-2"><FaHandshake className="text-orange-500"/> Trusted by Clients</li>
              <li className="flex items-center gap-2"><FaAward className="text-orange-500"/> Premium Quality Assured</li>
            </ul>
          </div>

          <div>
            <img
              src={Logo}
              alt="about-banner"
              className="w-full h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover rounded-2xl border"
            />
          </div>
        </div>

        {/* MIDDLE → Mission / Vision / Values */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3 hover:shadow transition">
            <FaBullseye className="text-2xl text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              To deliver premium e-commerce solutions with scalable, fast, and clean UI/UX experiences.
            </p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3 hover:shadow transition">
            <FaUsers className="text-2xl text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              To build digital storefronts that transform businesses into trusted global brands.
            </p>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-3 hover:shadow transition">
            <FaAward className="text-2xl text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900">Core Values</h3>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc pl-4">
              <li>Quality</li>
              <li>Trust</li>
              <li>Innovation</li>
              <li>Customer First</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM → Why Choose Us */}
        <div className="mt-14 bg-white border shadow-sm rounded-2xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaHandshake className="text-orange-500"/> Why Choose Us?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We specialize in building scalable MERN-based e-commerce frontends using clean, responsive,
            and component-driven architecture. This ensures faster iteration, maintainable code,
            and API-ready UI for backend integration later.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;
