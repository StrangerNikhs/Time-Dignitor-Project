import api from "./api";

export const signup = (payload) => api.post("/auth/signup", payload);
export const signin = (payload) => api.post("/auth/signin", payload);
export const logout = () => api.post("/auth/logout");
