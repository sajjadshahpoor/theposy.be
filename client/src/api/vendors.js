import { apiClient } from "./client.js";

export const vendorsApi = {
  list: (params) => apiClient.get("/vendors", { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/vendors/${id}`).then((r) => r.data),
  me: () => apiClient.get("/vendors/me").then((r) => r.data),
  updateProfile: (payload) => apiClient.patch("/vendors/me", payload).then((r) => r.data),
  uploadLogo: (formData) =>
    apiClient
      .post("/vendors/me/logo", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
};
