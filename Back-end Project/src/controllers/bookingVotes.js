import BookingService from "../services/booking.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";

/**
 * Get all bookings with pagination and filters
 * @route GET /api/booking-votes
 * @access Private (Admin, Staff)
 */
export const getAllBookingVotes = asyncHandler(async (req, res) => {
  const { page, limit, userId, status, startDate, endDate } = req.query;

  const result = await BookingService.getAllBookings({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    userId,
    status,
    startDate,
    endDate,
  });

  logger.info(`Retrieved ${result.data.length} bookings`);
  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Bookings retrieved successfully"
  );
});

/**
 * Get booking by ID
 * @route GET /api/booking-votes/:id
 * @access Private (Admin, Staff, Owner)
 */
export const getBookingVotesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await BookingService.getBookingById(id);

  logger.info(`Retrieved booking with ID: ${id}`);
  return ApiResponse.success(res, booking, "Booking retrieved successfully");
});

/**
 * Create new booking
 * @route POST /api/booking-votes
 * @access Private (Customer, Admin)
 */
export const createBookingVotes = asyncHandler(async (req, res) => {
  const { listBookingVotesDetails, ...bookingData } = req.body;

  const booking = await BookingService.createBooking(
    bookingData,
    listBookingVotesDetails
  );

  logger.info(`Booking created with ID: ${booking.BookingVotesId}`);
  return ApiResponse.created(res, booking, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update booking
 * @route PUT /api/booking-votes
 * @access Private (Admin, Owner)
 */
export const updateBookingVotes = asyncHandler(async (req, res) => {
  const { BookingVotesId, listBookingVotesDetails, ...bookingData } = req.body;

  const booking = await BookingService.updateBooking(
    BookingVotesId,
    bookingData,
    listBookingVotesDetails
  );

  logger.info(`Booking updated: ${BookingVotesId}`);
  return ApiResponse.success(res, booking, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete booking (soft delete)
 * @route DELETE /api/booking-votes/:id
 * @access Private (Admin, Owner)
 */
export const deleteBookingVotes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await BookingService.deleteBooking(id);

  logger.info(`Booking soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get booking statistics
 * @route GET /api/booking-votes/statistics/summary
 * @access Private (Admin, Staff)
 */
export const getBookingStatistics = asyncHandler(async (req, res) => {
  const stats = await BookingService.getBookingStatistics();

  logger.info("Retrieved booking statistics");
  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});

/**
 * Update booking status
 * @route PUT /api/booking-votes/:id/status
 * @access Private (Admin, Staff)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await BookingService.updateBookingStatus(id, status);

  logger.info(`Booking ${id} status updated to: ${status}`);
  return ApiResponse.success(res, booking, "Status updated successfully");
});
