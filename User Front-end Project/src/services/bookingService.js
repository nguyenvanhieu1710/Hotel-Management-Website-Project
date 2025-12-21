import api from "./api";

export const bookingService = {
  // Booking Votes (Main bookings)
  async getBookings(params = {}) {
    try {
      const response = await api.get("/booking-votes", { params });
      return {
        bookings: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch bookings");
    }
  },

  async getBookingById(id) {
    try {
      const response = await api.get(`/booking-votes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking details");
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await api.post("/booking-votes/create", bookingData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create booking");
    }
  },

  async updateBooking(bookingData) {
    try {
      const response = await api.put("/booking-votes/update", bookingData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to update booking");
    }
  },

  async deleteBooking(id) {
    try {
      const response = await api.delete(`/booking-votes/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to delete booking");
    }
  },

  async getUserBookings(userId) {
    try {
      const response = await api.get(`/booking-votes/user/${userId}`);
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user bookings");
    }
  },

  // Booking Details
  async getBookingDetails(bookingId) {
    try {
      const response = await api.get(
        `/booking-votes-detail/booking/${bookingId}`
      );
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking details");
    }
  },

  // Room availability check
  async checkRoomAvailability(roomId, checkinDate, checkoutDate) {
    try {
      const response = await api.get("/rooms/availability", {
        params: { roomId, checkinDate, checkoutDate },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to check room availability");
    }
  },

  // Rent Room Votes (Alternative booking system)
  async getRentBookings(params = {}) {
    try {
      const response = await api.get("/rent-room-votes", { params });
      return {
        rentBookings: response.data || [],
        pagination: response.pagination,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch rent bookings");
    }
  },

  async createRentBooking(rentData) {
    try {
      const response = await api.post("/rent-room-votes/create", rentData);
      return response.data;
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        throw new Error(errorMessages);
      }
      throw new Error(error.message || "Failed to create rent booking");
    }
  },

  // Payment related
  async processPayment(paymentData) {
    try {
      const response = await api.post("/payment/process", paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to process payment");
    }
  },

  async getPaymentHistory(userId) {
    try {
      const response = await api.get(`/payment/history/${userId}`);
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch payment history");
    }
  },
};

export default bookingService;
