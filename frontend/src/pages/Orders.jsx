import React, { useState } from "react";
import { FaClock, FaRedoAlt, FaTruck, FaChevronRight, FaShoppingBag } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { PiRepeatLight } from "react-icons/pi";

const dummyOrders = [
  ...Array.from({ length: 30 }, (_, i) => ({
    orderNo: 2133 + i,
    image: "https://via.placeholder.com/150",
    items: "Office Backpack",
    status: i % 2 === 0 ? "In Progress" : "Delivered",
    trackingId: 276413876 + i,
    deliveryDate: "30-11-2025 (Expected)",
    price: 2499,
  }))
];

const Orders = () => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const totalOrders = dummyOrders.length;
  const totalPages = Math.ceil(totalOrders / PER_PAGE);

  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;
  const ordersToShow = dummyOrders.slice(start, end);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <section className="min-h-screen bg-white px-3 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <FaShoppingBag /> Order History
        </h1>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border shadow-sm">
          <table className="w-full text-left">

            {/* Head */}
            <thead className="bg-gray-400 text-white whitespace-nowrap text-xs sm:text-sm">
              <tr>
                <th className="px-3 sm:px-4 py-3">Order No</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Delivery Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {ordersToShow.map((order, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-gray-50 transition text-xs sm:text-sm">

                  {/* Order No */}
                  <td className="px-3 sm:px-4 py-4 whitespace-nowrap font-semibold text-gray-900">
                    {order.orderNo}
                  </td>

                  {/* Items + Image */}
                  <td className="px-4 py-4 flex items-center gap-3 sm:gap-4 whitespace-nowrap">
                    <img src={order.image} alt={order.items} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg border object-cover"/>
                    <span className="font-medium text-gray-800">{order.items}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    {order.status === "In Progress" && (
                      <span className="flex items-center gap-1 sm:gap-2 text-yellow-600 font-semibold">
                        <FaClock /> {order.status}
                      </span>
                    )}
                    {order.status === "Delivered" && (
                      <span className="flex items-center gap-1 sm:gap-2 text-green-600 font-semibold">
                        <IoMdCheckmarkCircleOutline /> {order.status}
                      </span>
                    )}
                  </td>

                  {/* Tracking ID */}
                  <td className="px-4 py-4 font-mono text-gray-800 whitespace-nowrap">
                    {order.trackingId}
                  </td>

                  {/* Delivery Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {order.deliveryDate}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-gray-900">
                    ₹{order.price.toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button className="flex items-center justify-center gap-1 sm:gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition font-semibold text-[10px] sm:text-xs">
                      <FaRedoAlt /> Re-Order
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t text-gray-700 text-xs sm:text-sm">
          <p className="flex items-center gap-2">
            <FaBoxOpen /> Showing {page === 1 ? 1 : start + 1}-{Math.min(end, totalOrders)} of {totalOrders} orders
          </p>

          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-xs sm:text-sm hover:bg-gray-800 transition font-semibold ${
              page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next <FaChevronRight />
          </button>
        </div>

        {/* Mobile Notice */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-gray-500 text-[10px] sm:text-xs md:text-sm gap-4 border-t pt-5">
          <p className="flex items-center gap-2"><FaBoxOpen /> COD Available</p>
          <p className="flex items-center gap-2"><TbTruckDelivery /> 1-5 Days Delivery</p>
          <p className="flex items-center gap-2"><PiRepeatLight /> 7-Day Easy Replacement</p>
        </div>

      </div>
    </section>
  );
};

export default Orders;
