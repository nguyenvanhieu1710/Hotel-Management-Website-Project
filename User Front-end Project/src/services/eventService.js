import api from "./api";

export const eventService = {
  async getEvents(params = {}) {
    try {
      const response = await api.get("/event", { params });
      return {
        events: response.data,
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

  async getUpcomingEvents(limit = 10) {
    try {
      const response = await api.get("/event", {
        params: {
          limit,
          status: "Active",
          upcoming: true,
        },
      });
      return {
        events: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch upcoming events");
    }
  },

  async getEventsByType(eventTypeId, params = {}) {
    try {
      const response = await api.get("/event", {
        params: { ...params, eventTypeId },
      });
      return {
        events: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events by type");
    }
  },

  async searchEvents(searchTerm, params = {}) {
    try {
      const response = await api.get("/event", {
        params: { ...params, search: searchTerm },
      });
      return {
        events: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to search events");
    }
  },

  async bookEvent(eventBookingData) {
    try {
      const response = await api.post("/event-votes", eventBookingData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => err.message || err)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Event booking failed");
    }
  },

  async getUserEventBookings(userId, params = {}) {
    try {
      const response = await api.get(`/event-votes/user/${userId}`, { params });
      return {
        bookings: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event bookings");
    }
  },

  async cancelEventBooking(bookingId) {
    try {
      const response = await api.put(`/event-votes/${bookingId}/status`, {
        status: "Cancelled",
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to cancel event booking");
    }
  },
};

export default eventService;
