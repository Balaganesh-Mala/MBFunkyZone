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
  const { addToCartBackend } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState("description");
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
  });

  const stars = [1, 2, 3, 4, 5];

  // ✅ Fetch real product from API
  useEffect(() => {
    (async () => {
      if (!id || id === "undefined") {
        Swal.fire("Error", "Invalid Product ID", "error");
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
        Swal.fire("Error", "Failed to load product", "error");
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}/reviews`);
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error("Reviews load error:", err);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (product?.sizes) {
      const shirtSizes = product.sizes.shirt || [];
      const pantSizes = product.sizes.pant || [];

      if (pantSizes.length > 0) {
        setSize(pantSizes[0]); // first pant size default
      } else if (shirtSizes.length > 0) {
        setSize(shirtSizes[0]); // otherwise shirt size default
      }
    }
  }, [product]);

  // ✅ Save recently viewed product (_id)
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      const updated = [
        product._id,
        ...viewed.filter((v) => v !== product._id),
      ].slice(0, 10);
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

          const sp = res.data.products?.filter((p) => p._id !== id).slice(0, 5); // keep only 5

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

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire(
        "Login Required",
        "Please login to post a review",
        "warning"
      ).then(() => navigate("/login"));
    }

    if (review.rating === 0) {
      return Swal.fire("Rating Required ⭐", "Please give rating", "warning");
    }

    try {
      setLoading(true);
      const res = await api.post(`/products/${id}/review`, {
        // ✅ POST not PUT
        rating: review.rating,
        comment: review.comment, // ✅ correct key
      });

      if (res.data.success) {
        Swal.fire("Thank You", "Your review has been posted", "success");
        setReview({ name: "", email: "", comment: "", rating: 0 });
        setReviews(res.data.product.reviews); // update list instantly
      }
    } catch (err) {
      Swal.fire("Error", "Failed to post review ❗", "error");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row gap-4">

  {/* MAIN IMAGE (Mobile: 1, Desktop: 2) */}
  <div className="order-1 sm:order-2 flex-1">
    <img
      src={selectedImg || product.images?.[0]}
      alt={product.name}
      className="w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl border shadow-sm"
    />
  </div>

  {/* THUMBNAILS (Mobile: 2, Desktop: 1) */}
  <div className="order-2 sm:order-1 flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
    {product.images?.map((img, i) => (
      <img
        key={i}
        src={img}
        onClick={() => setSelectedImg(img)}
        className="w-[70px] h-[70px] sm:w-20 sm:h-20 object-cover rounded-xl border cursor-pointer hover:border-black transition"
      />
    ))}
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
            <p className="font-bold text-lg text-black">
              ₹{product.price?.toLocaleString()}
            </p>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1 text-orange-500 font-semibold text-lg">
              <FaStar /> {product.rating}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              ({product.reviews.length} Reviews)
            </span>
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
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">
              Select Size:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                ...(product.sizes?.shirt || []),
                ...(product.sizes?.pant || []),
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition ${
                    size === s
                      ? "bg-black text-white border-black"
                      : "text-gray-800 hover:border-black"
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
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-sm"
              >
                −
              </button>
              <span className="text-xs sm:text-sm min-w-[20px] text-center">
                {qty}
              </span>
              <button onClick={() => setQty((q) => q + 1)} className="text-sm">
                +
              </button>
            </div>

            <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  return Swal.fire(
                    "Login Required",
                    "Please login to add product to cart",
                    "warning"
                  ).then(() => navigate("/login"));
                }

                if (!size) {
                  return Swal.fire(
                    "Size Required",
                    "Please select a size",
                    "warning"
                  );
                }

                const data = await addToCartBackend(product._id, qty, size); // pass size also

                if (data.success) {
                  Swal.fire(
                    "Added",
                    `${product.name} added to cart`,
                    "success"
                  ).then(() => navigate("/cart")); // navigate to cart after login
                }
              }}
              className="flex items-center justify-center gap-2 flex-1 bg-black text-white py-3 rounded-full"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Buy Now UI preserved */}
          <button
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) {
                return Swal.fire(
                  "Login Required",
                  "Please login to buy product",
                  "warning"
                ).then(() => navigate("/login"));
              }

              if (!size) {
                return Swal.fire(
                  "Size Required",
                  "Please select a size",
                  "warning"
                );
              }

              const data = await addToCartBackend(product._id, qty, size);
              if (data.success) {
                navigate("/checkout");
              }

              if (data.success) {
                navigate("/checkout");
              }
            }}
            className="w-full border border-gray-300 py-3 rounded-full font-semibold hover:border-black transition text-xs sm:text-sm"
          >
            Buy Now
          </button>

          {/* BOTTOM ICONS UI preserved */}
          <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
            <p className="flex items-center gap-2">
              <TbTruckDelivery /> Free Delivery Available
            </p>
            <p className="flex items-center gap-2">
              <PiRepeatLight /> 7-Day Easy Replacement
            </p>
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
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {similar.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8 border-t mt-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
          Customer Reviews <span className="text-yellow-500">★</span>
        </h2>

        {/* Reviews List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full text-center py-10">
              No reviews yet 😕 Be the first one!
            </p>
          )}

          {reviews.map((r, i) => (
            <div
              key={i}
              className="group bg-gray-50 border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm text-gray-900">{r.name}</p>

                {/* Rating Stars */}
                <div className="flex text-yellow-500 text-sm gap-[2px]">
                  {stars.map((s) => (
                    <FaStar
                      key={s}
                      className={
                        r.rating >= s ? "text-yellow-500" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-gray-500 uppercase mt-[2px]">
                Rating: {r.rating} / 5
              </p>

              <p className="text-xs sm:text-sm text-gray-700 mt-3 leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="mt-10 bg-white border rounded-2xl p-6 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-3 tracking-wide">
            Write a Review ✍
          </h3>

          {/* Star Rating Input */}
          <div className="flex gap-1 mb-4">
            {stars.map((s) => (
              <FaStar
                key={s}
                onClick={() => setReview({ ...review, rating: s })}
                className={`cursor-pointer text-2xl transition ${
                  review.rating >= s
                    ? "text-yellow-500 scale-110"
                    : "text-gray-300"
                } hover:scale-110`}
              />
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            placeholder="Share your experience about the product..."
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="w-full border bg-gray-50 rounded-xl p-4 text-sm h-28 outline-none focus:border-gray-400 transition"
          />

          {/* Submit Button */}
          <button
            onClick={handleReviewSubmit}
            className="mt-4 bg-black text-white w-full py-3 rounded-full font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <FaShoppingCart /> Submit Review
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;