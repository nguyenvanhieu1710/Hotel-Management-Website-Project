import api from "./api";

export const eventService = {
  // Public endpoints (no authentication required)
  async getPublicEvents(params = {}) {
    try {
      const response = await api.get("/event/public", { params });
      return {
        events: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events");
    }
  },

  async getEventById(id) {
    try {
      const response = await api.get(`/event/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event details");
    }
  },

  // Protected endpoints (authentication required)
  async getEvents(params = {}) {
    try {
      const response = await api.get("/event", { params });
      return {
        events: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events");
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post("/event", eventData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create event");
    }
  },

  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/event/${id}`, eventData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update event");
    }
  },

  async deleteEvent(id) {
    try {
      const response = await api.delete(`/event/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete event");
    }
  },

  // Event types
  async getEventTypes() {
    try {
      const response = await api.get("/event-type/get-all");
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event types");
    }
  },

  // Event votes/bookings
  async getEventVotes(params = {}) {
    try {
      const response = await api.get("/event-votes", { params });
      return {
        eventVotes: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event votes");
    }
  },

  async createEventVote(voteData) {
    try {
      const response = await api.post("/event-votes/create", voteData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create event vote");
    }
  },

  async getUserEventVotes(userId) {
    try {
      const response = await api.get(`/event-votes/user/${userId}`);
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user event votes");
    }
  },

  // Helper methods
  async getUpcomingEvents(limit = 10) {
    try {
      const response = await api.get("/event/public", {
        params: {
          limit,
          filter: "upcoming",
          sort: "eventDate",
          order: "asc",
        },
      });
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch upcoming events");
    }
  },

  async getFeaturedEvents(limit = 5) {
    try {
      const response = await api.get("/event/public", {
        params: {
          limit,
          filter: "featured",
        },
      });
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch featured events");
    }
  },

  async searchEvents(searchTerm, params = {}) {
    try {
      const response = await api.get("/event/public", {
        params: {
          ...params,
          search: searchTerm,
        },
      });
      return {
        events: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to search events");
    }
  },
};

export default eventService;
