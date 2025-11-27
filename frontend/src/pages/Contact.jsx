import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dummy form submitted:", form);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto bg-white border rounded-2xl shadow-sm p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT → Contact Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Get in Touch</h2>

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full"><FaPhoneAlt/></div>
            <div>
              <p className="text-sm font-bold text-gray-800">Call Us</p>
              <p className="text-xs text-gray-500">+91 93245 67890</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full"><FaEnvelope/></div>
            <div>
              <p className="text-sm font-bold text-gray-800">Email Us</p>
              <p className="text-xs text-gray-500">support@clientstore.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full"><FaMapMarkerAlt/></div>
            <div>
              <p className="text-sm font-bold text-gray-800">Visit Us</p>
              <p className="text-xs text-gray-500">Tirupati, Andhra Pradesh, India</p>
            </div>
          </div>

          <div className="text-[10px] sm:text-xs text-gray-500 border-t pt-4 mt-6">
            <p>✔ Customer support 24/7</p>
            <p>✔ Fast & secure response</p>
            <p>✔ Trusted e-commerce solution</p>
          </div>
        </div>

        {/* RIGHT → Contact Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-md border p-5 sm:p-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-5 text-center">Send Your Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full bg-gray-100 border px-4 py-3 text-xs sm:text-sm rounded-full outline-none focus:border-black transition"
                required
              />

              <input
                name="email"
                onChange={handleChange}
                placeholder="Your Email Address"
                type="email"
                className="w-full bg-gray-100 border px-4 py-3 text-xs sm:text-sm rounded-full outline-none focus:border-black transition"
                required
              />

              <textarea
                name="message"
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full bg-gray-100 border px-4 py-3 text-xs sm:text-sm rounded-2xl outline-none focus:border-black transition h-32"
                required
              />

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> Send Message
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
