import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Booking Service
 * Handles all business logic for booking management
 */
class BookingService {
  /**
   * Get all bookings with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {number} options.userId - Filter by user ID
   * @param {string} options.status - Filter by status
   * @param {string} options.startDate - Filter by start date
   * @param {string} options.endDate - Filter by end date
   * @returns {Promise<Object>} Paginated bookings with metadata
   */
  async getAllBookings(options = {}) {
    const {
      page = 1,
      limit = 10,
      userId,
      status,
      startDate,
      endDate,
    } = options;

    const offset = (page - 1) * limit;
    let whereConditions = ["bv.Deleted = 0"];
    let params = [];

    // Build WHERE conditions
    if (userId) {
      whereConditions.push("bv.UserId = ?");
      params.push(userId);
    }

    if (status) {
      whereConditions.push("bv.Status = ?");
      params.push(status);
    }

    if (startDate) {
      whereConditions.push("bv.CheckinDate >= ?");
      params.push(startDate);
    }

    if (endDate) {
      whereConditions.push("bv.CheckoutDate <= ?");
      params.push(endDate);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM BookingVotes bv
      WHERE ${whereClause}
    `;
    const [countResult] = await executeMysqlQuery(countQuery, params);
    const total = countResult.total;

    // Get paginated data with user info
    const dataQuery = `
      SELECT 
        bv.*,
        u.UserName,
        u.PhoneNumber as UserPhone
      FROM BookingVotes bv
      LEFT JOIN Users u ON bv.UserId = u.UserId
      LEFT JOIN Account a ON u.UserId = a.AccountId
      WHERE ${whereClause}
      ORDER BY bv.BookingDate DESC
      LIMIT ? OFFSET ?
    `;
    const bookings = await executeMysqlQuery(dataQuery, [
      ...params,
      limit,
      offset,
    ]);

    return {
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get booking by ID with details
   * @param {number} bookingId - Booking ID
   * @returns {Promise<Object>} Booking with details
   */
  async getBookingById(bookingId) {
    const query = `
      SELECT 
        bv.*,
        u.UserName,
        u.PhoneNumber as UserPhone
      FROM BookingVotes bv
      LEFT JOIN Users u ON bv.UserId = u.UserId
      WHERE bv.BookingVotesId = ? AND bv.Deleted = 0
    `;
    const [booking] = await executeMysqlQuery(query, [bookingId]);

    if (!booking) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Booking"), 404);
    }

    // Get booking details
    const detailsQuery = `
      SELECT 
        bvd.*,
        r.RoomId as RoomNumber,
        r.Status as RoomStatus,
        rt.RoomTypeName
      FROM BookingVotesDetail bvd
      LEFT JOIN Room r ON bvd.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE bvd.BookingVotesId = ? AND bvd.Deleted = 0
    `;
    const details = await executeMysqlQuery(detailsQuery, [bookingId]);

    return {
      ...booking,
      details,
    };
  }

  /**
   * Get bookings by user ID
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's bookings
   */
  async getBookingsByUserId(userId, options = {}) {
    const { status, limit = 10 } = options;

    let whereConditions = ["UserId = ?", "Deleted = 0"];
    let params = [userId];

    if (status) {
      whereConditions.push("Status = ?");
      params.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    const query = `
      SELECT *
      FROM BookingVotes
      WHERE ${whereClause}
      ORDER BY BookingDate DESC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [...params, limit]);
  }

  /**
   * Create new booking with details
   * @param {Object} bookingData - Booking data
   * @param {Array} bookingDetails - Booking details (rooms)
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData, bookingDetails) {
    const {
      UserId,
      BookingDate,
      CheckinDate,
      CheckoutDate,
      Note,
      TotalAmount,
      Status = "Pending",
    } = bookingData;

    // Validate user exists
    await this.validateUserExists(UserId);

    // Validate dates
    this.validateBookingDates(CheckinDate, CheckoutDate);

    // Validate total amount
    if (!TotalAmount || TotalAmount <= 0) {
      throw new AppError("Total amount must be greater than 0", 400);
    }

    // Validate booking details (optional for simple bookings)
    if (bookingDetails && bookingDetails.length > 0) {
      // Check room availability only if rooms are specified
      await this.checkRoomAvailability(
        bookingDetails,
        CheckinDate,
        CheckoutDate
      );
    }

    // Insert booking
    const insertQuery = `
      INSERT INTO BookingVotes 
      (UserId, BookingDate, CheckinDate, CheckoutDate, Note, TotalAmount, Status, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      UserId,
      BookingDate,
      CheckinDate,
      CheckoutDate,
      Note,
      TotalAmount,
      Status,
    ]);

    const bookingId = result.insertId;

    // Insert booking details (if provided)
    if (bookingDetails && bookingDetails.length > 0) {
      for (const detail of bookingDetails) {
        await this.createBookingDetail(bookingId, detail);
      }
    }

    logger.info(`Booking created with ID: ${bookingId}`);
    return await this.getBookingById(bookingId);
  }

  /**
   * Create booking detail
   * @param {number} bookingId - Booking ID
   * @param {Object} detailData - Detail data
   * @returns {Promise<Object>} Created detail
   */
  async createBookingDetail(bookingId, detailData) {
    const { RoomId, RoomPrice, Note = "" } = detailData;

    // Validate room exists
    await this.validateRoomExists(RoomId);

    const query = `
      INSERT INTO BookingVotesDetail 
      (BookingVotesId, RoomId, RoomPrice, Note, Deleted)
      VALUES (?, ?, ?, ?, 0)
    `;

    return await executeMysqlQuery(query, [bookingId, RoomId, RoomPrice, Note]);
  }

  /**
   * Update booking
   * @param {number} bookingId - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @param {Array} bookingDetails - Updated booking details
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(bookingId, bookingData, bookingDetails) {
    // Check if booking exists
    const existingBooking = await this.getBookingById(bookingId);

    // Prevent updating confirmed or completed bookings
    if (["Confirmed", "Completed"].includes(existingBooking.Status)) {
      throw new AppError(
        `Cannot update booking with status: ${existingBooking.Status}`,
        400
      );
    }

    const {
      UserId,
      BookingDate,
      CheckinDate,
      CheckoutDate,
      Note,
      TotalAmount,
      Status,
    } = bookingData;

    // Validate user exists
    if (UserId) {
      await this.validateUserExists(UserId);
    }

    // Validate dates
    if (CheckinDate && CheckoutDate) {
      this.validateBookingDates(CheckinDate, CheckoutDate);
    }

    // Update booking
    const updateQuery = `
      UPDATE BookingVotes
      SET UserId = ?, BookingDate = ?, CheckinDate = ?, CheckoutDate = ?, 
          Note = ?, TotalAmount = ?, Status = ?
      WHERE BookingVotesId = ?
    `;
    await executeMysqlQuery(updateQuery, [
      UserId || existingBooking.UserId,
      BookingDate || existingBooking.BookingDate,
      CheckinDate || existingBooking.CheckinDate,
      CheckoutDate || existingBooking.CheckoutDate,
      Note !== undefined ? Note : existingBooking.Note,
      TotalAmount || existingBooking.TotalAmount,
      Status || existingBooking.Status,
      bookingId,
    ]);

    // Update booking details if provided
    if (bookingDetails && bookingDetails.length > 0) {
      for (const detail of bookingDetails) {
        if (detail.BookingVotesDetailId) {
          await this.updateBookingDetail(detail.BookingVotesDetailId, detail);
        } else {
          await this.createBookingDetail(bookingId, detail);
        }
      }
    }

    logger.info(`Booking updated: ${bookingId}`);
    return await this.getBookingById(bookingId);
  }

  /**
   * Update booking detail
   * @param {number} detailId - Detail ID
   * @param {Object} detailData - Updated detail data
   * @returns {Promise<Object>} Updated detail
   */
  async updateBookingDetail(detailId, detailData) {
    const { RoomId, RoomPrice, Note, Deleted } = detailData;

    const query = `
      UPDATE BookingVotesDetail
      SET RoomId = ?, RoomPrice = ?, Note = ?, Deleted = ?
      WHERE BookingVotesDetailId = ?
    `;

    return await executeMysqlQuery(query, [
      RoomId,
      RoomPrice,
      Note,
      Deleted || 0,
      detailId,
    ]);
  }

  /**
   * Update booking status
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated booking
   */
  async updateBookingStatus(bookingId, status) {
    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const query = `
      UPDATE BookingVotes
      SET Status = ?
      WHERE BookingVotesId = ? AND Deleted = 0
    `;

    const result = await executeMysqlQuery(query, [status, bookingId]);

    if (result.affectedRows === 0) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Booking"), 404);
    }

    logger.info(`Booking ${bookingId} status updated to: ${status}`);
    return await this.getBookingById(bookingId);
  }

  /**
   * Delete booking (soft delete)
   * @param {number} bookingId - Booking ID
   * @returns {Promise<void>}
   */
  async deleteBooking(bookingId) {
    // Check if booking exists
    const booking = await this.getBookingById(bookingId);

    // Prevent deleting confirmed or completed bookings
    if (["Confirmed", "Completed"].includes(booking.Status)) {
      throw new AppError(
        `Cannot delete booking with status: ${booking.Status}`,
        400
      );
    }

    // Soft delete booking
    const bookingQuery = `
      UPDATE BookingVotes
      SET Deleted = 1
      WHERE BookingVotesId = ?
    `;
    await executeMysqlQuery(bookingQuery, [bookingId]);

    // Soft delete booking details
    const detailsQuery = `
      UPDATE BookingVotesDetail
      SET Deleted = 1
      WHERE BookingVotesId = ?
    `;
    await executeMysqlQuery(detailsQuery, [bookingId]);

    logger.info(`Booking soft deleted: ${bookingId}`);
  }

  /**
   * Get booking statistics
   * @returns {Promise<Object>} Booking statistics
   */
  async getBookingStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) as pendingBookings,
        SUM(CASE WHEN Status = 'Confirmed' THEN 1 ELSE 0 END) as confirmedBookings,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completedBookings,
        SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledBookings,
        SUM(TotalAmount) as totalRevenue,
        AVG(TotalAmount) as averageBookingAmount
      FROM BookingVotes
      WHERE Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  /**
   * Get monthly booking report
   * @param {number} year - Year
   * @returns {Promise<Array>} Monthly report
   */
  async getMonthlyBookingReport(year) {
    const query = `
      SELECT 
        MONTH(BookingDate) as month,
        COUNT(*) as totalBookings,
        SUM(TotalAmount) as totalRevenue,
        AVG(TotalAmount) as averageAmount
      FROM BookingVotes
      WHERE YEAR(BookingDate) = ? AND Deleted = 0
      GROUP BY MONTH(BookingDate)
      ORDER BY month
    `;

    return await executeMysqlQuery(query, [year]);
  }

  // ==================== Validation Methods ====================

  /**
   * Validate user exists
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  async validateUserExists(userId) {
    const query = "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0";
    const [user] = await executeMysqlQuery(query, [userId]);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("User"), 404);
    }
  }

  /**
   * Validate room exists
   * @param {number} roomId - Room ID
   * @returns {Promise<void>}
   */
  async validateRoomExists(roomId) {
    const query = "SELECT RoomId FROM Room WHERE RoomId = ? AND Deleted = 0";
    const [room] = await executeMysqlQuery(query, [roomId]);

    if (!room) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Room"), 404);
    }
  }

  /**
   * Validate booking dates
   * @param {string} checkinDate - Check-in date
   * @param {string} checkoutDate - Check-out date
   * @returns {void}
   */
  validateBookingDates(checkinDate, checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Set checkin to start of day for comparison
    const checkinDateOnly = new Date(checkin);
    checkinDateOnly.setHours(0, 0, 0, 0);

    if (checkinDateOnly < today) {
      throw new AppError("Check-in date cannot be in the past", 400);
    }

    if (checkout < checkin) {
      throw new AppError(
        "Check-out date must be on or after check-in date",
        400
      );
    }
  }

  /**
   * Check room availability
   * @param {Array} bookingDetails - Booking details
   * @param {string} checkinDate - Check-in date
   * @param {string} checkoutDate - Check-out date
   * @returns {Promise<void>}
   */
  async checkRoomAvailability(bookingDetails, checkinDate, checkoutDate) {
    for (const detail of bookingDetails) {
      const { RoomId } = detail;

      // Check if room is available
      const query = `
        SELECT COUNT(*) as count
        FROM BookingVotesDetail bvd
        JOIN BookingVotes bv ON bvd.BookingVotesId = bv.BookingVotesId
        WHERE bvd.RoomId = ? 
          AND bv.Deleted = 0 
          AND bvd.Deleted = 0
          AND bv.Status IN ('Pending', 'Confirmed')
          AND (
            (bv.CheckinDate <= ? AND bv.CheckoutDate >= ?) OR
            (bv.CheckinDate <= ? AND bv.CheckoutDate >= ?) OR
            (bv.CheckinDate >= ? AND bv.CheckoutDate <= ?)
          )
      `;

      const [result] = await executeMysqlQuery(query, [
        RoomId,
        checkinDate,
        checkinDate,
        checkoutDate,
        checkoutDate,
        checkinDate,
        checkoutDate,
      ]);

      if (result.count > 0) {
        throw new AppError(
          `Room ${RoomId} is not available for the selected dates`,
          400
        );
      }
    }
  }
}

export default new BookingService();
