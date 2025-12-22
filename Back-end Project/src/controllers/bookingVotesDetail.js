import { executeMysqlQuery } from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all booking details
 * @route GET /api/booking-votes-detail
 * @access Private (Admin, Staff)
 */
export const getAllBookingVotesDetail = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;

  let query = `
    SELECT 
      bvd.*,
      rt.RoomTypeName
    FROM BookingVotesDetail bvd
    LEFT JOIN Room r ON bvd.RoomId = r.RoomId
    LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
    WHERE bvd.Deleted = 0
  `;
  const params = [];

  if (bookingId) {
    query += " AND bvd.BookingVotesId = ?";
    params.push(bookingId);
  }

  const bookingVotesDetail = await executeMysqlQuery(query, params);

  logger.info(`Retrieved ${bookingVotesDetail.length} booking details`);
  return ApiResponse.success(
    res,
    bookingVotesDetail,
    "Booking details retrieved successfully"
  );
});

/**
 * Get booking detail by ID
 * @route GET /api/booking-votes-detail/:id
 * @access Private (Admin, Staff)
 */
export const getBookingVotesDetailById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [bookingVotesDetail] = await executeMysqlQuery(
    `SELECT 
      bvd.*,
      rt.RoomTypeName
    FROM BookingVotesDetail bvd
    LEFT JOIN Room r ON bvd.RoomId = r.RoomId
    LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
    WHERE bvd.BookingVotesDetailId = ? AND bvd.Deleted = 0`,
    [id]
  );

  if (!bookingVotesDetail) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Booking Detail"), 404);
  }

  logger.info(`Retrieved booking detail with ID: ${id}`);
  return ApiResponse.success(
    res,
    bookingVotesDetail,
    "Booking detail retrieved successfully"
  );
});
