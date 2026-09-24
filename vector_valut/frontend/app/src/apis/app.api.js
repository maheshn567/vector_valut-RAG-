import api from "./axios";

// Create a new application
export const createApp = (data) => api.post("/app/create", data);

// Get a single application's details (verified owner)
export const getApp = (data) => api.post("/app/get-app", data);

// Get all applications for the authenticated tenant
export const getTenantApps = () => api.get("/app/tenant-apps");

// Update application configuration parameters
export const updateApp = (id, data) => api.patch(`/app/update-app/${id}`, data);

const appApi = {
  createApp,
  getApp,
  getTenantApps,
  updateApp,
};

export default appApi;