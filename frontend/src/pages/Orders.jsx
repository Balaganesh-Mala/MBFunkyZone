import React, { useState, useEffect } from "react";
import { getMyOrders } from "../api/order.api.js";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import Button from "../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // ✅ your working auth key

  const loadOrders = async () => {
    if (!token) {
      setOrders([]); // ✅ guest user should see empty orders
      setLoading(false);
      return; // ❗ Stop API call for guest
    }

    try {
      setLoading(true);
      const res = await getMyOrders();
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error("Order Fetch Error:", err);
      setOrders([]); // ✅ Silent fail — no popup alert for fetch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const paginated = orders.slice(start, start + PER_PAGE);

  return (
    <main className="min-h-screen bg-white px-4 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-extrabold mb-6 uppercase tracking-wide text-gray-900">
          Order History
        </h1>

        {/* ✅ Guest login suggestion UI centered */}
        {!token && (
          <div className="bg-gray-50 border rounded-2xl p-5 mb-6 shadow-sm flex flex-col justify-center items-center text-center">
            <p className="text-gray-500 text-sm mb-3">
              Login to view your orders.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        )}

        {/* ✅ Loader */}
        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl text-sm shadow-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left">Order No</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-center">Payment</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {/* ✅ No orders */}
                {!orders.length && token && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-10">
                      No orders yet 😕
                    </td>
                  </tr>
                )}

                {paginated.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-bold">
                      {o.orderNo || o._id.slice(-6)}
                    </td>

                    <td className="p-3 text-xs sm:text-sm text-gray-800">
                      {o.orderItems?.map((i) => i.name).join(", ") || ""}
                    </td>

                    <td className="p-3 text-center text-gray-700">
                      {o.paymentMethod}
                    </td>

                    <td className="p-3 text-center text-gray-700">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border">
                        {o.orderStatus}
                      </span>
                    </td>

                    <td className="p-3 text-right font-bold">
                      ₹{(o.totalPrice || 0).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          Swal.fire("Feature Soon", "Re-Order feature coming soon!", "info")
                        }
                        className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-semibold hover:bg-gray-800 transition"
                      >
                        Re-Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Pagination if logged in */}
        {!loading && token && totalPages > 1 && (
          <footer className="flex justify-end gap-3 mt-6">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</Button>
            <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</Button>
          </footer>
        )}

      </div>
    </main>
  );
};

export default Orders;
