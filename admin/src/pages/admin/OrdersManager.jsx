import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || res.data || []);
      console.log(res.data.orders);
    } catch (err) {
      console.error("Orders fetch error", err);
      Swal.fire("Error", "Failed to load orders", "error");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setStatusUpdating(true);
      await api.put(`/orders/${orderId}/status`, { status });
      Swal.fire("Updated", "Order status changed", "success");
      loadOrders();
      setStatusUpdating(false);
      setSelectedOrder(null);
    } catch (err) {
      Swal.fire("Update Failed", err.message, "error");
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Order No</th>
                  <th className="py-2 text-left">User</th>
                  <th className="py-2 text-left">Total</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b">
                    <td className="py-2">{o.orderNo || o._id.slice(-6)}</td>
                    <td className="py-2">{o.user?.name || "Guest"}</td>
                    <td className="py-2">₹{o.totalPrice || o.totalPrice}</td>
                    <td className="py-2">
                      <Badge className={getStatusColor(o.orderStatus)}>
                        {o.orderStatus}
                      </Badge>
                    </td>
                    <td className="py-2 text-center">
                      <Button size="sm" onClick={() => setSelectedOrder(o)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}

                {!orders.length && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========== Order Details Modal ========== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-semibold text-lg">
                Order #{selectedOrder.orderNo}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 text-xl hover:text-red-500"
              >
                ✖
              </button>
            </div>

            {/* User */}
            <div>
              <p className="font-semibold">User:</p>
              <p>{selectedOrder.user?.name || "Guest Checkout"}</p>
              <p>{selectedOrder.user?.email || ""}</p>
            </div>

            {/* Shipping Address */}
            {/* Shipping Address */}
            <div className="bg-gray-50 p-2 rounded-xl">
              <p className="font-semibold">Shipping Address:</p>
              <p>{selectedOrder.shippingAddress?.name}</p>
              <p>{selectedOrder.shippingAddress?.street}</p>
              <p>
                {selectedOrder.shippingAddress?.city},
                {selectedOrder.shippingAddress?.state} -
                {selectedOrder.shippingAddress?.pincode}
              </p>
              <p>{selectedOrder.shippingAddress?.phone}</p>
            </div>

            {/* Payment */}
            <div>
              <p className="font-semibold">Payment Method:</p>
              <Badge>{selectedOrder.paymentMethod}</Badge>
              <p className="font-semibold mt-2">Payment Status:</p>
              <Badge>{selectedOrder.paymentStatus}</Badge>
            </div>

            {/* Items */}
            <div>
              <p className="font-semibold">Order Items:</p>
              <div className="max-h-40 overflow-y-auto border rounded-xl">
                {selectedOrder.orderItems?.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-2 p-2 border-b last:border-0"
                  >
                    <img
                      src={item.image}
                      className="w-12 h-12 object-cover rounded-lg"
                      alt="item"
                    />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-xs">
                        ₹{item.price} × {item.quantity}
                      </p>
                      {item.size && <Badge size="sm">Size: {item.size}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div>
              <p className="font-semibold mb-1">Update Status:</p>
              <Select onValueChange={(v) => updateStatus(selectedOrder._id, v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {statusUpdating && (
              <p className="text-sm text-gray-500 animate-pulse">
                Updating status...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
