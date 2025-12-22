import api from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.success && response.data) {
        // Backend returns account data in response.data
        // Token is inside the account object: response.data.token
        const token = response.data.token;
        const user = response.data; // This is the account data

        console.log("Extracted token:", token);
        console.log("Extracted user:", user);

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token saved to localStorage");
        }

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          console.log("User saved to localStorage:", user);
        }

        return {
          token: token,
          user: user,
        };
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("Logout successful - localStorage cleared");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still clear localStorage
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
