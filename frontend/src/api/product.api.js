import api from "./api";

export const getProducts = (params) => api.get("/products", { params });
export const refreshProducts = (params) => api.get("/products/refresh", { params });
export const createProduct = (payload) => api.post("/products", payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getStats = () => api.get("/products/stats");
