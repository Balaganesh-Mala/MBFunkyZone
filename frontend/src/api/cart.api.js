import api from "./axios.js";

export const apiAddToCart = (productId, quantity = 1) =>
  api.post("/cart/add", { productId, quantity });

export const apiGetUserCart = () => api.get("/cart");

export const apiUpdateCartItem = (productId, quantity) =>
  api.put("/cart/update", { productId, quantity });

export const apiRemoveFromCart = (productId) =>
  api.delete("/cart/remove", { data: { productId } });

export const apiClearCart = () => api.delete("/cart/clear");
export const apiPlaceOrder = (payload) => api.post("/api/orders", payload);