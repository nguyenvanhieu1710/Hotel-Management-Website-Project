import api from "./api";

export const staffService = {
  // Public endpoints (no authentication required)
  async getPublicStaff(params = {}) {
    try {
      const response = await api.get("/staff/public", { params });
      return {
        staff: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch staff");
    }
  },

  // Protected endpoints (authentication required)
  async getStaff(params = {}) {
    try {
      const response = await api.get("/staff", { params });
      return {
        staff: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch staff");
    }
  },

  async getStaffById(id) {
    try {
      const response = await api.get(`/staff/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch staff details");
    }
  },

  async createStaff(staffData) {
    try {
      const response = await api.post("/staff", staffData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create staff");
    }
  },

  async updateStaff(id, staffData) {
    try {
      const response = await api.put(`/staff/${id}`, staffData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update staff");
    }
  },

  async deleteStaff(id) {
    try {
      const response = await api.delete(`/staff/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete staff");
    }
  },

  // Staff statistics and positions
  async getStaffStatistics() {
    try {
      const response = await api.get("/staff/statistics/summary");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch staff statistics");
    }
  },

  async getPositions() {
    try {
      const response = await api.get("/staff/positions/list");
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch positions");
    }
  },
};

export default staffService;
