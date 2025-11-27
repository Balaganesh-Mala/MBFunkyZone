import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <aside className="bg-white w-full max-w-[420px] sm:max-w-[460px] rounded-2xl shadow-lg p-6 sm:p-8 space-y-5">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center">
          Login
        </h2>

        {/* Email */}
        <div className="relative">
          <input
            onChange={handleChange}
            name="email"
            placeholder="Enter your email"
            className="w-full bg-gray-100 px-4 py-3 text-sm rounded-full outline-none border focus:border-black"
          />
          <FaEnvelope className="absolute right-4 top-3.5 text-gray-400" />
        </div>

        {/* Password */}
        <div className="relative">
          <input
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full bg-gray-100 px-4 py-3 text-sm rounded-full outline-none border focus:border-black"
          />
          {showPassword ? (
            <FaEyeSlash
              onClick={() => setShowPassword(false)}
              className="absolute right-4 top-4 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEye
              onClick={() => setShowPassword(true)}
              className="absolute right-4 top-4 text-gray-400 cursor-pointer"
            />
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/cart")}
          className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition text-sm"
        >
          Login
        </button>

        <p className="text-center text-xs text-gray-600 font-medium">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </aside>
    </div>
  );
};

export default Login;
