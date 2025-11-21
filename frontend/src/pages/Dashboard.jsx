import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import Analytics from "./Analytics";
import { logout as apiLogout } from "../api/auth.api";

export default function Dashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showAdd ? "Close" : "+ Add Product"}
          </button>
          <button
            onClick={async () => {
              try {
                await apiLogout();
              } catch (err) {
              }
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-6">
          <AddProduct />
        </div>
      )}

      <ProductList />
      <Analytics />
    </div>
  );
}
