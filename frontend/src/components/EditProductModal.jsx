import React, { useState, useEffect } from "react";

export default function EditProductModal({ open, product, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", category: "", price: "", description: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        price: product.price != null ? String(product.price) : "",
        description: product.description || "",
      });
      setErrors({});
    }
  }, [product]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.name || !form.name.trim()) e.name = "Name is required";
    const priceNum = Number(form.price);
    if (form.price === "" || Number.isNaN(priceNum) || priceNum < 0) e.price = "Price must be a positive number";
    if (!form.category || !form.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(product._id, {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        description: form.description,
      });
      onClose(true);
    } catch (err) {
      // bubble up; parent will set toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Product</h3>
          <button onClick={() => onClose(false)} className="text-gray-500">✖</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full border rounded px-3 py-2" />
            {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input value={form.category} onChange={(e) => setForm(f => ({...f, category: e.target.value}))} className="w-full border rounded px-3 py-2" />
              {errors.category && <div className="text-xs text-red-600 mt-1">{errors.category}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input value={form.price} onChange={(e) => setForm(f => ({...f, price: e.target.value}))} type="number" min="0" step="0.01" className="w-full border rounded px-3 py-2" />
              {errors.price && <div className="text-xs text-red-600 mt-1">{errors.price}</div>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} rows={3} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={() => onClose(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-indigo-600 text-white rounded">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
