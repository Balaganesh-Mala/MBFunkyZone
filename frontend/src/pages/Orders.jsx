import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { getMyOrders } from "../api/order.api.js";
import Button from "../components/ui/button.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error("Order Fetch Error:", err);
      Swal.fire("Error", "Failed to fetch orders ❗", "error");
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
        <h1 className="text-2xl font-extrabold mb-6 uppercase tracking-wide">
          Order History
        </h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-black" />
          </div>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="p-3 text-left">Order No</th>
                <th className="text-start">Items</th>
                <th className="text-center">Payment</th>
                <th className="text-center">Status</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((o) => (
                <tr
                  key={o._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-bold">
                    {o.orderNo || o._id.slice(0, 6)}
                  </td>

                  <td>{o.orderItems.map((i) => i.name).join(", ")}</td>

                  <td className="text-center">{o.paymentMethod}</td>

                  <td className="text-center font-semibold">{o.status}</td>

                  <td className="text-right p-3 font-bold">
                    ₹{o.totalPrice.toLocaleString()}
                  </td>

                  <td className="text-center">
                    <button className="px-4 py-2 bg-black text-white rounded-full text-[10px] font-semibold hover:bg-gray-800 transition">
                      Re-Order
                    </button>
                  </td>
                </tr>
              ))}

              {!orders.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gray-500 py-10"
                  >
                    No orders yet ❗
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <footer className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </Button>

            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </Button>
          </footer>
        )}
      </div>
    </main>
  );
};

export default Orders;
