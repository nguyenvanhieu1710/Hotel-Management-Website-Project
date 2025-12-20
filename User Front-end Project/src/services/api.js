import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

// Request interceptor - Add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle new response format
api.interceptors.response.use(
  (response) => {
    // Backend trả về { success: true, data: ..., message: ... }
    if (response.data && response.data.success) {
      return response.data; // Trả về { success, data, message, pagination }
    }
    // If no success field, assume it's successful (for backward compatibility)
    if (response.data && !response.data.hasOwnProperty("success")) {
      return {
        success: true,
        data: response.data,
        message: "Success",
      };
    }
    return Promise.reject(response.data);
  },
  (error) => {
    const errorData = error.response?.data;

    // Handle different error scenarios
    if (errorData) {
      if (errorData.success === false) {
        return Promise.reject(errorData);
      }
      // If error data doesn't have success field, wrap it
      return Promise.reject({
        success: false,
        message: errorData.message || error.message || "Request failed",
        errors: errorData.errors || [],
      });
    }

    // Network or other errors
    return Promise.reject({
      success: false,
      message: error.message || "Network error",
      errors: [],
    });
  }
);

export default api;
