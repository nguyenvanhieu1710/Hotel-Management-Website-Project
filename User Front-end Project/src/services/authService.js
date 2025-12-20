import api from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.success && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }

      throw new Error(response.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error types
      if (error.message) {
        throw new Error(error.message);
      } else if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => err.message || err)
          .join(", ");
        throw new Error(errorMessages);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || "Registration failed");
    } catch (error) {
      console.error("Register error:", error);

      // Handle validation errors
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field || "Field"}: ${err.message || err}`)
          .join(", ");
        throw new Error(errorMessages);
      }

      if (error.message) {
        throw new Error(error.message);
      }

      throw new Error("Registration failed. Please try again.");
    }
  },

  async logout() {
    try {
      // Optional: Call backend logout endpoint
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me");
      if (response.success) {
        return response.data;
      }
      throw new Error("Failed to get user info");
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
