import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EditProductModal from "../components/EditProductModal";
import {
  getProducts,
  refreshProducts,
  deleteProduct,
  updateProduct,
} from "../api/product.api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [source, setSource] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ page, limit });
      setProducts(data.data || data);
      setSource(data.source || "API");
      if (data.meta) setMeta(data.meta);
      setMsg("");
    } catch (err) {
      setMsg("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    load();
  }, [page, limit]);

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await refreshProducts({ page, limit });
      setProducts(data.data || data);
      setSource(data.source || "DB");
      if (data.meta) setMeta(data.meta);
      setMsg("Refreshed from DB");
    } catch (err) {
      setMsg("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setMsg("Product deleted");
    } catch (e) {
      setMsg("Delete failed");
    }
  };

  const update = async (id, payload) => {
    try {
      const { data } = await updateProduct(id, payload);
      setProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
      setMsg("Product updated");
      setToast("Product updated successfully");
      setTimeout(() => setToast(""), 3000);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Update failed");
      throw e;
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const message = e?.detail?.message || "Product created";
      setToast(message);
      setPage(1);
      load();
    };
    window.addEventListener("product:created", handler);
    return () => window.removeEventListener("product:created", handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Source: <span className="font-medium">{source}</span>
          </span>
          <button
            onClick={load}
            className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm"
          >
            Reload
          </button>
          <button
            onClick={refresh}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Refresh
          </button>
          <Link
            to="/add"
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            + Add
          </Link>
        </div>
      </div>

      {msg && <div className="mb-4 text-sm text-indigo-700">{msg}</div>}

      {loading ? (
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="p-3 border rounded-lg animate-pulse bg-white"
            />
          ))}
        </ul>
      ) : products && products.length ? (
        <>
          <ul className="space-y-4">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onDelete={remove}
                onEdit={(prod) => setEditingProduct(prod)}
              />
            ))}
          </ul>
          <EditProductModal
            open={!!editingProduct}
            product={editingProduct}
            onClose={(saved) => {
              setEditingProduct(null);
              if (saved) {
                // toast already set by update
              }
            }}
            onSave={update}
          />
          {toast && (
            <div role="status" aria-live="polite" className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-md">
              {toast}
            </div>
          )}
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm"
                disabled={page <= 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {meta.page || page} of{" "}
                {meta.totalPages ||
                  Math.max(1, Math.ceil((meta.total || 0) / (limit || 1)))}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm"
                disabled={meta.totalPages ? page >= meta.totalPages : false}
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <div className="text-lg font-medium">No products yet</div>
          <div className="mt-3">
            <Link
              to="/add"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add your first product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
