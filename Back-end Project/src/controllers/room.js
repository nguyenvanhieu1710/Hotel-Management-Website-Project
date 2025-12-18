import roomService from "../services/room.service.js";
import {
  roomSchema,
  createRoomSchema,
  updateRoomSchema,
} from "../schemas/room.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from "../constants/index.js";

/**
 * Get All Rooms Controller
 * @route GET /api/rooms
 * @access Public
 */
export const getAllRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  // Extract filters from query
  const filters = {
    status: req.query.status,
    roomTypeId: req.query.roomTypeId,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
  };

  const result = await roomService.getAllRooms(page, limit, filters);

  return ApiResponse.paginated(
    res,
    result.rooms,
    page,
    limit,
    result.pagination.total,
    "Rooms retrieved successfully"
  );
});

/**
 * Get Room By ID Controller
 * @route GET /api/rooms/:id
 * @access Public
 */
export const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const room = await roomService.getRoomById(id);

  return ApiResponse.success(res, room, "Room retrieved successfully");
});

/**
 * Get Available Rooms Controller
 * @route GET /api/rooms/available
 * @access Public
 */
export const getAvailableRooms = asyncHandler(async (req, res) => {
  const criteria = {
    roomTypeId: req.query.roomTypeId,
    minGuests: req.query.minGuests,
    maxPrice: req.query.maxPrice,
  };

  const rooms = await roomService.getAvailableRooms(criteria);

  return ApiResponse.success(
    res,
    rooms,
    "Available rooms retrieved successfully"
  );
});

/**
 * Create Room Controller
 * @route POST /api/rooms
 * @access Private (Admin)
 */
export const createRoom = asyncHandler(async (req, res) => {
  // Validate request data
  const { error } = createRoomSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    throw new AppError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const result = await roomService.createRoom(req.body);

  return ApiResponse.success(res, result, result.message, HTTP_STATUS.CREATED);
});

/**
 * Update Room Controller
 * @route PUT /api/rooms/:id
 * @access Private (Admin)
 */
export const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request data
  const { error } = updateRoomSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    throw new AppError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const result = await roomService.updateRoom(id, req.body);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Update Room Status Controller
 * @route PATCH /api/rooms/:id/status
 * @access Private (Admin/Staff)
 */
export const updateRoomStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Status is required", HTTP_STATUS.BAD_REQUEST);
  }

  const result = await roomService.updateRoomStatus(id, status);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Delete Room Controller
 * @route DELETE /api/rooms/:id
 * @access Private (Admin)
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await roomService.deleteRoom(id);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Get Room Statistics Controller
 * @route GET /api/rooms/statistics
 * @access Private (Admin)
 */
export const getRoomStatistics = asyncHandler(async (req, res) => {
  const statistics = await roomService.getRoomStatistics();

  return ApiResponse.success(
    res,
    statistics,
    "Room statistics retrieved successfully"
  );
});

export default {
  getAllRooms,
  getRoomById,
  getAvailableRooms,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  getRoomStatistics,
};
