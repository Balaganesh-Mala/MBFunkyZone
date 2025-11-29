import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Switch } from "../../components/ui/switch.jsx";
import { ImagePlus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  // hold newly selected files (null = not replaced)
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  // previews are always URLs (either existing or created object URLs for new files)
  const [imagePreviews, setImagePreviews] = useState(["", "", "", ""]);

  // optional categories list (if you want datalist like AddProduct)
  const [categories, setCategories] = useState([]);

  // Load categories (optional)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data.categories || []);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Load product
  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      const p = res.data;

      setForm({
        name: p.name || "",
        price: p.price || "",
        mrp: p.mrp || "",
        category: p.category || "",
        brand: p.brand || "",
        stock: p.stock || "",
        description: p.description || "",
        isFeatured: !!p.isFeatured,
        isBestSeller: !!p.isBestSeller,
        isActive: p.isActive === undefined ? true : !!p.isActive,
        sizes: p.sizes || { shirt: [], pant: [] },
      });

      // Expect p.images to be an array of urls (length maybe 4). Normalize to 4 slots.
      const imgs = Array.isArray(p.images) ? p.images.slice(0, 4) : [];
      while (imgs.length < 4) imgs.push("");
      setImagePreviews(imgs);
      setImageFiles([null, null, null, null]);
    } catch (err) {
      console.error("Load Error:", err);
      Swal.fire("Error", "Failed to load product ❗", "error");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (type, value) => {
    setForm((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [type]: value.split(",").map((s) => s.trim()).filter(Boolean),
      },
    }));
  };

  // choose/replace an image slot
  const handleImageSelect = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);

      const newPreviews = [...imagePreviews];
      // create temporary object URL for preview
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);
    };
    fileInput.click();
  };

  // submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // require 4 image URLs (either kept or newly uploaded)
    if (imagePreviews.some((p) => !p)) {
      Swal.fire("Error", "Please provide 4 images before updating ❗", "warning");
      setStep(2);
      return;
    }

    try {
      setUpdating(true);

      // upload only replaced images: imageFiles[i] != null
      const uploadedUrls = [...imagePreviews];

      if (imageFiles.some((f) => f !== null)) {
        for (let i = 0; i < imageFiles.length; i++) {
          if (imageFiles[i]) {
            const fd = new FormData();
            // backend endpoint `/products/upload` expected single file named 'images'
            fd.append("images", imageFiles[i]);
            const res = await api.post("/products/upload", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            // assume response contains `res.data.url` with uploaded image URL
            uploadedUrls[i] = res.data.url || uploadedUrls[i];
          }
        }
      }

      const payload = {
        ...form,
        images: uploadedUrls,
      };

      await api.put(`/products/${id}`, payload);

      Swal.fire("Updated!", "Product updated ✅", "success");
      navigate("/admin/products");
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire("Error", err?.response?.data?.message || "Update failed ❗", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-xl">←</button>
          <h1 className="text-xl md:text-2xl font-bold">Edit Product</h1>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/products")}>
          Back to Products
        </Button>
      </div>

      {/* Step navigator */}
      <div className="flex gap-2 flex-wrap text-xs md:text-sm">
        {["Product Info", "Upload Images", "Sizes", "Review & Submit"].map((label, i) => (
          <div
            key={i}
            onClick={() => setStep(i + 1)}
            className={`px-3 py-1.5 rounded-full border cursor-pointer transition ${
              step === i + 1 ? "bg-black text-white" : "bg-white text-gray-600"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 md:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STEP 1 — Product Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input name="name" value={form.name} onChange={handleChange} required />
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
                    {categories.map((c) => <option key={c._id} value={c.name} />)}
                  </datalist>
                </div>

                <div>
                  <Label>Brand *</Label>
                  <Input name="brand" value={form.brand} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Price *</Label>
                    <Input type="number" name="price" value={form.price} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>MRP *</Label>
                    <Input type="number" name="mrp" value={form.mrp} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <Label>Stock *</Label>
                  <Input type="number" name="stock" value={form.stock} onChange={handleChange} required />
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full h-28 border rounded-xl p-3 text-sm focus:outline-none focus:border-black/40"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 2 — Upload / Replace Images */}
            {step === 2 && (
              <div className="space-y-3">
                <Label>Upload / Replace 4 Images *</Label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  {imagePreviews.map((prev, i) => (
                    <div
                      key={i}
                      onClick={() => handleImageSelect(i)}
                      className="relative w-full aspect-square border-2 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-gray-400 transition"
                    >
                      {prev ? (
                        <img src={prev} alt={`preview-${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="w-7 h-7 text-gray-400" />
                      )}

                      {/* show small replaced badge if user selected new file */}
                      {imageFiles[i] && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                          Replaced
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] md:text-xs text-gray-500">
                  {imagePreviews.filter(Boolean).length}/4 selected
                </p>

                <div className="flex justify-between pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>← Back</Button>
                  <Button type="button" onClick={() => setStep(3)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 3 — Sizes */}
            {step === 3 && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Shirt Sizes</Label>
                  <Input
                    placeholder="S, M, L, XL"
                    value={form.sizes?.shirt.join(",")}
                    onChange={(e) => handleSizeChange("shirt", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Pant Sizes</Label>
                  <Input
                    placeholder="28, 30, 32, 34"
                    value={form.sizes?.pant.join(",")}
                    onChange={(e) => handleSizeChange("pant", e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(4)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 4 — Toggles + Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between border p-2 rounded">
                    <Label>Featured</Label>
                    <Switch checked={form.isFeatured} onCheckedChange={(val) => handleToggle("isFeatured", val)} />
                  </div>

                  <div className="flex justify-between border p-2 rounded">
                    <Label>Best Seller</Label>
                    <Switch checked={form.isBestSeller} onCheckedChange={(val) => handleToggle("isBestSeller", val)} />
                  </div>

                  <div className="flex justify-between border p-2 rounded">
                    <Label>Active</Label>
                    <Switch checked={form.isActive} onCheckedChange={(val) => handleToggle("isActive", val)} />
                  </div>
                </div>

                <div className="text-center space-y-4 py-6">
                  <h2 className="text-lg md:text-xl font-bold">Review & Update</h2>

                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button variant="outline" type="button" onClick={() => setStep(3)}>← Back</Button>

                    <Button type="submit" disabled={updating}>
                      {updating ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Update Product"
                      )}
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

export default EditProduct;
