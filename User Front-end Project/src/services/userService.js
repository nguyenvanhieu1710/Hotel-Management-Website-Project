import api from "./api";

export const userService = {
  // Get user profile by ID (for profile page)
  async getUserProfileById(accountId) {
    try {
      const response = await api.get(`/user/profile/${accountId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user profile");
    }
  },

  // Get current user profile (authenticated)
  async getUserProfile() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user profile");
    }
  },

  async updateUserProfile(userData) {
    try {
      const response = await api.put("/user/profile", userData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update profile");
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await api.put("/user/change-password", passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to change password");
    }
  },

  async uploadAvatar(formData) {
    try {
      const response = await api.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to upload avatar");
    }
  },

  // Public endpoints for homepage
  async getAllUsers() {
    try {
      const response = await api.get("/user/public");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  async getEvaluations() {
    try {
      const response = await api.get("/evaluation");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch evaluations");
    }
  },

  async submitReview(reviewData) {
    try {
      const response = await api.post("/evaluation", reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to submit review");
    }
  },

  async sendEmail(emailData) {
    try {
      const response = await api.post("/account/send-email", emailData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to send email");
    }
  },
};

export default userService;
