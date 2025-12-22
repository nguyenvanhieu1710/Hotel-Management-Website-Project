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

  async getUserBookingsWithDetails(userId) {
    try {
      const bookings = await this.getUserBookings(userId);

      // Fetch additional details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          try {
            // Get booking details
            const bookingDetails = await this.getBookingDetails(
              booking.BookingVotesId
            );

            // Get room details if we have room ID
            let roomDetails = null;
            if (
              bookingDetails &&
              bookingDetails.length > 0 &&
              bookingDetails[0].RoomId
            ) {
              try {
                const roomResponse = await api.get(
                  `/rooms/public/${bookingDetails[0].RoomId}`
                );
                roomDetails = roomResponse.data;
              } catch (roomError) {
                console.warn(
                  `Failed to fetch room details for room ${bookingDetails[0].RoomId}:`,
                  roomError
                );
              }
            }

            return {
              ...booking,
              bookingDetails: bookingDetails || [],
              roomDetails: roomDetails,
              numberOfNights: this.calculateNights(
                booking.CheckinDate,
                booking.CheckoutDate
              ),
              pricePerNight: roomDetails ? roomDetails.Price : null,
            };
          } catch (detailError) {
            console.warn(
              `Failed to fetch details for booking ${booking.BookingVotesId}:`,
              detailError
            );
            return {
              ...booking,
              bookingDetails: [],
              roomDetails: null,
              numberOfNights: this.calculateNights(
                booking.CheckinDate,
                booking.CheckoutDate
              ),
              pricePerNight: null,
            };
          }
        })
      );

      return bookingsWithDetails;
    } catch (error) {
      throw new Error(
        error.message || "Failed to fetch user bookings with details"
      );
    }
  },

  calculateNights(checkinDate, checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const timeDiff = checkout.getTime() - checkin.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },

  // Booking Details
  async getBookingDetails(bookingId) {
    try {
      const response = await api.get(
        `/booking-votes-detail/get-data-by-id/${bookingId}`
      );
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking details");
    }
  },

  async getBookingDetailsByBookingId(bookingId) {
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
      const response = await api.post("/payment", paymentData);
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
