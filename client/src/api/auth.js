import { apiClient } from "./client.js";

export const authApi = {
  me: () => apiClient.get("/auth/me").then((r) => r.data),
  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  registerCustomer: (payload) => apiClient.post("/auth/register", payload).then((r) => r.data),
  loginCustomer: (payload) => apiClient.post("/auth/login", payload).then((r) => r.data),

  registerVendor: (payload) => apiClient.post("/auth/vendor/register", payload).then((r) => r.data),
  loginVendor: (payload) => apiClient.post("/auth/vendor/login", payload).then((r) => r.data),
};
