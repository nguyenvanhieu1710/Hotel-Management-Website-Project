import api from "./api";

export const bookingService = {
  async createBooking(bookingData) {
    try {
      const response = await api.post("/booking-votes", bookingData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => err.message || err)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Booking failed");
    }
  },

  async getUserBookings(userId, params = {}) {
    try {
      const response = await api.get(`/booking-votes/user/${userId}`, {
        params,
      });
      return {
        bookings: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch bookings");
    }
  },

  async getBookingById(bookingId) {
    try {
      const response = await api.get(`/booking-votes/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking details");
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.put(`/booking-votes/${bookingId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update booking status");
    }
  },

  async cancelBooking(bookingId) {
    try {
      const response = await api.put(`/booking-votes/${bookingId}/status`, {
        status: "Cancelled",
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to cancel booking");
    }
  },

  async getBookingHistory(userId, params = {}) {
    try {
      const response = await api.get(`/booking-votes/user/${userId}`, {
        params: { ...params, includeHistory: true },
      });
      return {
        bookings: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking history");
    }
  },
};

export default bookingService;
