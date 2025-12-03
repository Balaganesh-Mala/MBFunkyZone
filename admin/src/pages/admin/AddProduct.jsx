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

  const [form, setForm] = useState({
    name: "",
    price: "",
    mrp: "",
    category: "",
    brand: "",
    description: "",
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    sizes: { shirt: [], pant: [] }, // ✅ Correct structure
  });

  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState(["", "", "", ""]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories);
      } catch (error) {
        Swal.fire("Error", "Failed to load categories ❗", "error");
      }
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

      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPrev = [...previews];
      newPrev[index] = URL.createObjectURL(file);
      setPreviews(newPrev);
    };

    fileInput.click();
  };

  // ✅ Fix Size Handler — Save sizes without comma in DB, only comma in UI
  const handleSizeChange = (type, value) => {
    setForm(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [type]: value.split(",").map(s => ({
          size: s.trim(),
          stock: 0  // default stock, admin can edit later
        }))
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.some((img) => img === null)) {
      Swal.fire("Error", "Select all 4 images ❗", "warning");
      setStep(2);
      return;
    }

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("mrp", form.mrp);
    fd.append("category", form.category);
    fd.append("brand", form.brand);
    fd.append("description", form.description);
    fd.append("isFeatured", form.isFeatured);
    fd.append("isBestSeller", form.isBestSeller);
    fd.append("isActive", form.isActive);

    // ✅ Important — Send sizes in JSON format to match backend
    fd.append("sizes", JSON.stringify({
      shirt: form.sizes.shirt,
      pant: form.sizes.pant
    }));

    // ✅ append images
    images.forEach((file) => fd.append("images", file));

    try {
      setSubmitting(true);

      await api.post("/products/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("Success!", "Product added! 🎉", "success");
      navigate("/admin/products");

    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Upload failed ❗", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-7 space-y-6 relative">
      {submitting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-[2000]">
          <Loader2 className="animate-spin w-6 h-6 mb-2" />
          <p className="text-sm font-semibold text-gray-700">Submitting Product...</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h1 className="text-xl md:text-2xl font-bold">Add Product</h1>
      </div>

      <div className="flex gap-2 flex-wrap text-xs md:text-sm">
        {["Product Info", "Upload Images", "Sizes", "Submit"].map((label, i) => (
          <div key={i} onClick={() => setStep(i + 1)}
            className={`px-3 py-1.5 rounded-full border cursor-pointer ${
              step === i + 1 ? "bg-black text-white" : "bg-white text-gray-600"
            }`}>
            {label}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 md:p-7 space-y-5">
          <form onSubmit={handleSubmit}>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid gap-4">
                <Label>Product Name *</Label>
                <Input name="name" value={form.name} onChange={handleChange} required />

                <Label>Category *</Label>
                <select name="category" value={form.category} onChange={handleChange} required
                  className="w-full border rounded-xl p-2 text-sm">
                  <option value="" disabled>Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <Label>Brand *</Label>
                <Input name="brand" value={form.brand} onChange={handleChange} required />

                <Label>Price *</Label>
                <Input type="number" name="price" value={form.price} onChange={handleChange} required />

                <Label>MRP *</Label>
                <Input type="number" name="mrp" value={form.mrp} onChange={handleChange} required />

                <Label>Description</Label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className="w-full h-28 border rounded-xl p-3 text-sm" />

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-3">
                <Label>Upload 4 Images *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  {images.map((_, i) => (
                    <div key={i} onClick={() => handleImageSelect(i)}
                      className="w-full aspect-square border-2 rounded-2xl flex items-center justify-center cursor-pointer bg-gray-50">
                      {previews[i] ? (
                        <img src={previews[i]} className="w-full h-full object-cover rounded-2xl"/>
                      ) : (
                        <ImagePlus className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>← Back</Button>
                  <Button type="button" onClick={() => setStep(3)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid gap-4">
                <Label>Shirt Sizes</Label>
                <Input placeholder="S, M, L, XL"
                  value={form.sizes.shirt.map(s => s.size).join(",")}
                  onChange={(e) => handleSizeChange("shirt", e.target.value)} />

                <Label>Pant Sizes</Label>
                <Input placeholder="28, 30, 32, 34"
                  value={form.sizes.pant.map(s => s.size).join(",")}
                  onChange={(e) => handleSizeChange("pant", e.target.value)} />

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(4)}>Next →</Button>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="border p-2 rounded flex justify-between">
                  <Label>Featured</Label>
                  <Switch checked={form.isFeatured}
                    onCheckedChange={(val) => handleToggle("isFeatured", val)} />
                </div>

                <div className="border p-2 rounded flex justify-between">
                  <Label>Best Seller</Label>
                  <Switch checked={form.isBestSeller}
                    onCheckedChange={(val) => handleToggle("isBestSeller", val)} />
                </div>

                <div className="border p-2 rounded flex justify-between">
                  <Label>Active</Label>
                  <Switch checked={form.isActive}
                    onCheckedChange={(val) => handleToggle("isActive", val)} />
                </div>

                <div className="text-center py-6">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Publishing..." : "Publish Product"}
                  </Button>

                  <Button variant="outline" type="button" onClick={() => setStep(3)} className="mt-4">
                    ← Back
                  </Button>
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
