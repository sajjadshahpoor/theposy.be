import { apiClient } from "./client.js";

export const ordersApi = {
  checkout: (payload) => apiClient.post("/orders", payload).then((r) => r.data),
  track: (orderNumber, email) =>
    apiClient.get("/orders/track", { params: { orderNumber, email } }).then((r) => r.data),
  get: (id) => apiClient.get(`/orders/${id}`).then((r) => r.data),
  mine: () => apiClient.get("/orders/mine").then((r) => r.data),
  vendorOrders: () => apiClient.get("/orders/vendor").then((r) => r.data),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
};
