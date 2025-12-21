import api from "./api";

export const serviceService = {
  // Public endpoints (no authentication required)
  async getPublicServices(params = {}) {
    try {
      const response = await api.get("/service/public", { params });
      return {
        services: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch services");
    }
  },

  // Protected endpoints (authentication required)
  async getServices(params = {}) {
    try {
      const response = await api.get("/service", { params });
      return {
        services: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch services");
    }
  },

  async getServiceById(id) {
    try {
      const response = await api.get(`/service/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch service details");
    }
  },

  async createService(serviceData) {
    try {
      const response = await api.post("/service", serviceData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create service");
    }
  },

  async updateService(id, serviceData) {
    try {
      const response = await api.put(`/service/${id}`, serviceData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update service");
    }
  },

  async deleteService(id) {
    try {
      const response = await api.delete(`/service/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete service");
    }
  },

  // Service types
  async getServiceTypes() {
    try {
      const response = await api.get("/service-type/get-all");
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch service types");
    }
  },
};

export default serviceService;
