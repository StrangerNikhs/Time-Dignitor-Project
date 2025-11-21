import React, { useState } from "react";
import { createProduct } from "../api/product.api";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const payload = {
        name,
        price: Number(price),
        category,
        description: desc,
      };

      const res = await createProduct(payload);
      setMsg("Product created successfully!");
      // notify product list to refresh and show toast
      try {
        window.dispatchEvent(new CustomEvent("product:created", { detail: { message: "Product created successfully!", product: res?.data } }));
      } catch (e) {}
      setName("");
      setPrice("");
      setCategory("");
      setDesc("");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Add New Product
        </h2>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-gray-700 font-medium">Product Name</label>
            <input
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
              focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Price (₹)</label>
              <input
                className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 
                focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Category</label>
              <input
                className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
                focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="e.g. Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 
              focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Write a short description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Add Product"}
            </button>

            <button
              type="button"
              onClick={() => {
                setName("");
                setPrice("");
                setCategory("");
                setDesc("");
                setMsg("");
              }}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>

        {msg && (
          <div className="mt-3 text-center text-sm font-medium text-green-600">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
