import React from "react";

export default function ProductCard({ product, onDelete, onEdit }) {
  return (
    <li className="flex items-start justify-between bg-white border rounded p-4 shadow-sm hover:shadow-md transition">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">₹{product.price}</div>
            <div className="text-xs text-gray-400">{product._id?.slice(-6)}</div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600">{product.description || "No description"}</p>
      </div>

      <div className="ml-4 flex-shrink-0 flex items-center gap-2">
        <button onClick={() => onEdit(product)} className="px-3 py-1 bg-yellow-400 text-black rounded text-sm">
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
