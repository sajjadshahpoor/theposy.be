import { apiClient } from "./client.js";

export const productsApi = {
  list: (params) => apiClient.get("/products", { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/products/${id}`).then((r) => r.data),
  mine: () => apiClient.get("/products/mine").then((r) => r.data),
  create: (formData) =>
    apiClient.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id, formData) =>
    apiClient
      .patch(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  remove: (id) => apiClient.delete(`/products/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  list: () => apiClient.get("/categories").then((r) => r.data),
  create: (name) => apiClient.post("/categories", { name }).then((r) => r.data),
};
