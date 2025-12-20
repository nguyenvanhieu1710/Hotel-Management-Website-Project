import api from "./api";

export const serviceService = {
  async getServices(params = {}) {
    try {
      const response = await api.get("/service", { params });
      return {
        services: response.data,
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

  async getPopularServices(limit = 10) {
    try {
      const response = await api.get("/service", {
        params: {
          limit,
          popular: true,
        },
      });
      return {
        services: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch popular services");
    }
  },

  async searchServices(searchTerm, params = {}) {
    try {
      const response = await api.get("/service", {
        params: { ...params, search: searchTerm },
      });
      return {
        services: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to search services");
    }
  },
};

export default serviceService;
