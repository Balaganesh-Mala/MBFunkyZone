import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  FaStar,
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import { TbTruckDelivery } from "react-icons/tb";
import { PiRepeatLight } from "react-icons/pi";
import ProductCard from "../components/ui/ProductCard";
import { Loader2 } from "lucide-react";
import api from "../api/axios.js"; // ✅ axios using env already

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState("");
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState("description");
  const [review, setReview] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const stars = [1, 2, 3, 4, 5];

  // ✅ Fetch real product from API
  useEffect(() => {
    (async () => {
      if (!id || id === "undefined") {
        Swal.fire("Error", "Invalid Product ID ❗", "error");
        return navigate("/shop");
      }

      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setProduct(p);

        // set default image preview
        setSelectedImg(p.images?.[0] || "");
      } catch (err) {
        console.error("Load Error:", err);
        Swal.fire("Error", "Failed to load product ❗", "error");
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ Save recently viewed product (_id)
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      const updated = [product._id, ...viewed.filter(v => v !== product._id)].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  }, [product]);

  // ✅ Load similar products based on linked category (_id)
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (product?.category?._id) {
          const res = await api.get("/products", {
            params: { category: product.category._id },
          });

          const sp = res.data.products
            ?.filter(p => p._id !== id)
            .slice(0, 5); // keep only 5

          setSimilar(sp || []);
        }
      } catch (err) {
        console.error("Similar Fetch error:", err);
      }
    })();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Product not found ❗
      </div>
    );
  }

  // ❗ SimilarProducts should come from `similar` state now, dummy removed

  return (
    <div className="w-full bg-white">

      {/* Back Button UI untouched */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition"
        >
          <FaArrowLeft /> Back to Shop
        </button>
      </div>

      {/* MAIN SECTION UI preserved */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* IMAGE GALLERY UI preserved, only using real DB data */}
        <div className="flex flex-col sm:flex-row lg:flex-row gap-4">
          <div className="flex sm:flex-row lg:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImg(img)}
                className="w-[70px] sm:w-20 h-[70px] sm:h-20 object-cover rounded-xl border cursor-pointer hover:border-black transition"
              />
            ))}
          </div>

          <div className="flex-1">
            <img
              src={selectedImg || product.images?.[0]}
              alt={product.name}
              className="w-full h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl border shadow-sm"
            />
          </div>
        </div>

        {/* PRODUCT INFO UI preserved */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>

            <button
              onClick={() => setLiked(!liked)}
              className="text-gray-400 hover:text-red-500 text-xl transition"
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>

          {/* PRICE & RATING UI preserved */}
          <div className="flex items-center flex-wrap gap-2 text-sm sm:text-lg">
            <p className="font-bold text-lg text-black">₹{product.price?.toLocaleString()}</p>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg">
              <FaStar /> {product.rating}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">({product.reviews.length} Reviews)</span>
          </div>

          <hr className="border-gray-200" />

          {/* DESCRIPTION UI preserved */}
          <div className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            <p>{product.description}</p>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-600">
              <li>Premium Material</li>
              <li>Lightweight & Durable</li>
              <li>Suitable for Office & Travel</li>
              <li>Stylish Modern Look</li>
            </ul>
          </div>

          {/* SIZE selector UI preserved */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Select Size:</p>
            <div className="flex flex-wrap gap-2">
              {[...(product.sizes?.shirt || []), ...(product.sizes?.pant || [])].map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                    size === s ? "bg-black text-white border-black" : "text-gray-800 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY + ADD TO CART UI preserved */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 border w-fit px-4 py-2 rounded-full bg-gray-50">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-sm">−</button>
              <span className="text-xs sm:text-sm min-w-[20px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="text-sm">+</button>
            </div>

            <button
              onClick={() => {
                addToCart({ ...product, qty });
                Swal.fire({
                  icon: "success",
                  title: "Added to Cart",
                  text: `${product.name} added successfully ✅`,
                  showConfirmButton: false,
                  timer: 1500,
                  toast: true,
                  position: "top-end",
                });
              }}
              className="flex items-center justify-center gap-2 flex-1 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition text-xs sm:text-sm"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Buy Now UI preserved */}
          <button className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:border-black transition text-gray-900 text-xs sm:text-sm">
            Buy Now
          </button>

          {/* BOTTOM ICONS UI preserved */}
          <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
            <p className="flex items-center gap-2"><TbTruckDelivery /> Free Delivery Available</p>
            <p className="flex items-center gap-2"><PiRepeatLight /> 7-Day Easy Replacement</p>
          </div>

          {/* Show linked category name if needed anywhere */}
          <p className="text-xs sm:text-sm text-gray-600">
            Category: <strong>{product.category?.name}</strong>
          </p>

        </div>
      </div>

      {/* SIMILAR PRODUCT SECTION UI preserved, only data source fixed */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {similar.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetails;
