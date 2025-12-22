import api from "./api";

export const emailService = {
  /**
   * Send contact email
   * @param {Object} emailData - Email data
   * @param {string} emailData.name - Sender name
   * @param {string} emailData.email - Sender email
   * @param {string} emailData.message - Message content
   * @returns {Promise<Object>} Email send result
   */
  async sendContactEmail(emailData) {
    try {
      const response = await api.post("/account/send-email", emailData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to send contact email");
    }
  },

  /**
   * Send booking confirmation email
   * @param {Object} bookingData - Booking data
   * @param {string} bookingData.customerEmail - Customer email
   * @param {string} bookingData.customerName - Customer name
   * @param {Object} bookingData.booking - Booking details
   * @param {Object} bookingData.room - Room details
   * @returns {Promise<Object>} Email send result
   */
  async sendBookingConfirmationEmail(bookingData) {
    try {
      const response = await api.post(
        "/account/send-booking-email",
        bookingData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.message || "Failed to send booking confirmation email"
      );
    }
  },
};

export default emailService;
