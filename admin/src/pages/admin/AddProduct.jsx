import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Switch } from "../../components/ui/switch.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { ImagePlus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const AddProduct = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    mrp: "",
    category: "",
    brand: "",
    stock: "",
    description: "",
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    sizes: { shirt: [], pant: [] },
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState(["", "", "", ""]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data.categories || []);
      } catch {}
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const newFiles = [...images];
      newFiles[index] = file;
      setImages(newFiles);

      const newPrev = [...previews];
      newPrev[index] = URL.createObjectURL(file);
      setPreviews(newPrev);
    };

    fileInput.click();
  };

  const handleSizeChange = (type, value) => {
    setForm((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [type]: value.split(",").map((s) => s.trim()),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.some((img) => img === null)) {
      Swal.fire("Error", "Please select all 4 images ❗", "warning");
      setStep(2);
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "sizes") fd.append("sizes", JSON.stringify(value));
      else fd.append(key, value);
    });

    images.forEach((file) => fd.append("images", file));

    try {
      setSubmitting(true);

      await api.post("/products/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success!", "Product added successfully! 🎉", "success");
      navigate("/admin/products");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Upload failed ❗",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-7 space-y-6 relative">
      {submitting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-[2000]">
          <Loader2 className="animate-spin w-6 h-6 mb-2" />
          <p className="text-sm font-semibold text-gray-700">
            Submitting Product...
          </p>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-xl">
            ←
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Add Product (Admin)
          </h1>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap text-xs md:text-sm">
        {["Product Info", "Upload Images", "Sizes", "Submit"].map(
          (label, i) => (
            <div
              key={i}
              onClick={() => setStep(i + 1)}
              className={`px-3 py-1.5 rounded-full border cursor-pointer transition ${
                step === i + 1
                  ? "bg-black text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {label}
            </div>
          )
        )}
      </div>

      <Card>
        <CardContent className="p-5 md:p-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Category *</Label>
                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    list="categoryList"
                    required
                  />
                  <datalist id="categoryList">
                    {categories.map((c) => (
                      <option key={c._id} value={c.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <Label>Brand *</Label>
                  <Input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>MRP *</Label>
                    <Input
                      type="number"
                      name="mrp"
                      value={form.mrp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full h-28 border rounded-xl p-3 text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-3">
                <Label>Upload 4 Images *</Label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => handleImageSelect(i)}
                      className="relative w-full aspect-square border-2 rounded-2xl flex items-center justify-center bg-gray-50 cursor-pointer"
                    >
                      {previews[i] ? (
                        <img
                          src={previews[i]}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  {images.filter(Boolean).length}/4 selected
                </p>

                <div className="flex justify-between pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Shirt Sizes</Label>
                  <Input
                    placeholder="S, M, L, XL"
                    value={form.sizes.shirt.join(",")}
                    onChange={(e) => handleSizeChange("shirt", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Pant Sizes</Label>
                  <Input
                    placeholder="28, 30, 32, 34"
                    value={form.sizes.pant.join(",")}
                    onChange={(e) => handleSizeChange("pant", e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(4)}>
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {/* STEP 4 — Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between border p-2 rounded">
                    <Label>Featured</Label>
                    <Switch
                      checked={form.isFeatured}
                      onCheckedChange={(val) => handleToggle("isFeatured", val)}
                    />
                  </div>

                  <div className="flex justify-between border p-2 rounded">
                    <Label>Best Seller</Label>
                    <Switch
                      checked={form.isBestSeller}
                      onCheckedChange={(val) =>
                        handleToggle("isBestSeller", val)
                      }
                    />
                  </div>

                  <div className="flex justify-between border p-2 rounded">
                    <Label>Active</Label>
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(val) => handleToggle("isActive", val)}
                    />
                  </div>
                </div>

                <div className="text-center space-y-4 py-6">
                  <h2 className="text-lg md:text-xl font-bold">
                    Review & Publish
                  </h2>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </span>
                    ) : (
                      "Publish Product"
                    )}
                  </Button>

                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep(3)}
                    >
                      ← Back
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
