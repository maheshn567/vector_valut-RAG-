import axios from "axios";

// In Vite, environment variables are accessed via import.meta.env
// Fallback to localhost backend API gateway
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enables sharing of HttpOnly authentication cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically inject credentials on outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const tenantId = localStorage.getItem("tenantId") || sessionStorage.getItem("tenantId");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (tenantId) {
      config.headers["X-Tenant-Id"] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize data unboxing and error messages
api.interceptors.response.use(
  (response) => {
    // If backend returns standard wrappers, return data sub-field
    return response.data;
  },
  (error) => {
    const parsedError = {
      message: error.response?.data?.error?.message || error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status,
      code: error.response?.data?.error?.code || "API_ERROR",
      success: false,
    };
    return Promise.reject(parsedError);
  }
);

export default api;