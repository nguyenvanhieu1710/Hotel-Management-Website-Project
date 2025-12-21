import api from "./api";

export const evaluationService = {
  // Public endpoints (no authentication required)
  async getEvaluations(params = {}) {
    try {
      const response = await api.get("/evaluation", { params });
      return {
        evaluations: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch evaluations");
    }
  },

  async getEvaluationById(id) {
    try {
      const response = await api.get(`/evaluation/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch evaluation details");
    }
  },

  async getEvaluationsByRoom(roomId, params = {}) {
    try {
      const response = await api.get(`/evaluation/room/${roomId}`, { params });
      return {
        evaluations: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch room evaluations");
    }
  },

  async getRoomRatingStats(roomId) {
    try {
      const response = await api.get(`/evaluation/room/${roomId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch room rating stats");
    }
  },

  // Protected endpoints (authentication required)
  async createEvaluation(evaluationData) {
    try {
      const response = await api.post("/evaluation", evaluationData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create evaluation");
    }
  },

  async updateEvaluation(id, evaluationData) {
    try {
      const response = await api.put(`/evaluation/${id}`, evaluationData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update evaluation");
    }
  },

  async deleteEvaluation(id) {
    try {
      const response = await api.delete(`/evaluation/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete evaluation");
    }
  },

  async updateEvaluationStatus(id, status) {
    try {
      const response = await api.put(`/evaluation/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update evaluation status");
    }
  },

  // Admin/Staff endpoints
  async getEvaluationStatistics() {
    try {
      const response = await api.get("/evaluation/statistics/summary");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch evaluation statistics");
    }
  },

  // Helper methods
  async getUserEvaluations(userId, params = {}) {
    try {
      const response = await api.get("/evaluation", {
        params: { ...params, userId },
      });
      return {
        evaluations: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user evaluations");
    }
  },

  async getRecentEvaluations(limit = 10) {
    try {
      const response = await api.get("/evaluation", {
        params: { limit, sort: "createdAt", order: "desc" },
      });
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch recent evaluations");
    }
  },
};

export default evaluationService;
