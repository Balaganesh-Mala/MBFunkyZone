import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "../../components/ui/button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card.jsx";
import { Switch } from "../../components/ui/switch.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProductManager = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products/admin/all");
      setProducts(
        res.data.products?.map((p) => ({
          ...p,
          category: p.category || {}, // ensure category object always exists
        })) || []
      );
    } catch (err) {
      console.error("Fetch error", err);
      Swal.fire("Error", "Failed to fetch products ❗", "error");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggle = async (id, field, value) => {
    try {
      await api.put(`/products/${id}`, { [field]: value });
      loadProducts();
    } catch {
      Swal.fire("Error", `Failed to update ${field} ❗`, "error");
    }
  };

  const handleEdit = (p) => {
    navigate(`/admin/products/edit/${p._id}`);
  };

  const handleDelete = async (id) => {
    const r = await Swal.fire({
      title: "Delete product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it!",
      cancelButtonText: "Cancel",
    });

    if (r.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        Swal.fire("Deleted!", "Product deleted ✅", "success");
        loadProducts();
      } catch {
        Swal.fire("Error", "Delete failed ❗", "error");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* 🔹 Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Admin Product Manager
        </h1>
        <Button onClick={() => navigate("/admin/products/add")}>
          + Add Product
        </Button>
      </div>

      {/* 🔹 Product List */}
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            {/* 🟦 Responsive Table */}
            <table className="min-w-[600px] w-full text-xs md:text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left font-semibold text-gray-700">
                  <th className="p-2 md:p-3">Product</th>
                  <th className="p-2 md:p-3">Category</th>
                  <th className="p-2 md:p-3">Price</th>
                  <th className="p-2 md:p-3">Stock</th>
                  <th className="p-2 md:p-3">Active</th>
                  <th className="p-2 md:p-3">Featured</th>
                  <th className="p-2 md:p-3">Best Seller</th>
                  <th className="p-2 md:p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-2 md:p-3 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="p-2 md:p-3">{p.category.name}</td>
                    <td className="p-2 md:p-3">
                      ₹{Number(p.price).toLocaleString()}
                    </td>
                    <td className="p-2 md:p-3">{p.totalStock}</td>

                    {/* 🟡 Toggle Switch */}
                    <td className="p-2 md:p-3">
                      <Switch
                        checked={p.isActive}
                        onCheckedChange={(val) =>
                          handleToggle(p._id, "isActive", val)
                        }
                      />
                    </td>

                    <td className="p-2 md:p-3">
                      <Switch
                        checked={p.isFeatured}
                        onCheckedChange={(val) =>
                          handleToggle(p._id, "isFeatured", val)
                        }
                      />
                    </td>

                    <td className="p-2 md:p-3">
                      <Switch
                        checked={p.isBestSeller}
                        onCheckedChange={(val) =>
                          handleToggle(p._id, "isBestSeller", val)
                        }
                      />
                    </td>

                    {/* 🔘 Edit & Delete */}
                    <td className="p-2 md:p-3 space-x-2 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {!products.length && (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 p-5">
                      No Products Found ❗
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;
