import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../constants/index.js";
import { deviceSchema } from "../schemas/device.js";
import DeviceService from "../services/device.service.js";
import logger from "../utils/logger.js";

/**
 * Get all devices with pagination and filtering
 * @route GET /api/devices
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {number} deviceTypeId - Filter by device type
 * @query {number} roomId - Filter by room
 * @query {string} status - Filter by status
 * @query {number} minPrice - Minimum price
 * @query {number} maxPrice - Maximum price
 */
export const getAllDevices = asyncHandler(async (req, res) => {
  const { page, limit, deviceTypeId, roomId, status, minPrice, maxPrice } =
    req.query;

  const result = await DeviceService.getAllDevices({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    deviceTypeId: deviceTypeId ? parseInt(deviceTypeId) : undefined,
    roomId: roomId ? parseInt(roomId) : undefined,
    status,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  });

  logger.info(`Retrieved ${result.data.length} devices`);

  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination.page,
    result.pagination.limit,
    result.pagination.total,
    "Devices retrieved successfully"
  );
});

/**
 * Get device by ID
 * @route GET /api/devices/:id
 * @param {number} id - Device ID
 */
export const getDeviceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const device = await DeviceService.getDeviceById(id);

  logger.info(`Retrieved device with ID: ${id}`);

  return ApiResponse.success(res, device, "Device retrieved successfully");
});

/**
 * Create new device
 * @route POST /api/devices
 * @body {object} deviceData - Device information
 */
export const createDevice = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = deviceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return ApiResponse.error(
      res,
      "Validation failed",
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const device = await DeviceService.createDevice(req.body);

  logger.info(
    `Created new device: ${device.DeviceName} (ID: ${device.DeviceId})`
  );

  return ApiResponse.success(
    res,
    device,
    SUCCESS_MESSAGES.CREATED,
    HTTP_STATUS.CREATED
  );
});

/**
 * Update device information
 * @route PUT /api/devices/:id
 * @param {number} id - Device ID
 * @body {object} deviceData - Updated device information
 */
export const updateDevice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request body
  const { error } = deviceSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return ApiResponse.error(
      res,
      "Validation failed",
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const device = await DeviceService.updateDevice(id, req.body);

  logger.info(`Updated device with ID: ${id}`);

  return ApiResponse.success(res, device, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Soft delete device
 * @route DELETE /api/devices/:id
 * @param {number} id - Device ID
 */
export const deleteDevice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await DeviceService.deleteDevice(id);

  logger.info(`Soft deleted device with ID: ${id}`);

  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get devices by room
 * @route GET /api/devices/room/:roomId
 * @param {number} roomId - Room ID
 */
export const getDevicesByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const devices = await DeviceService.getDevicesByRoom(roomId);

  logger.info(`Retrieved ${devices.length} devices for room ID: ${roomId}`);

  return ApiResponse.success(res, devices, "Devices retrieved successfully");
});

/**
 * Get devices by type
 * @route GET /api/devices/type/:deviceTypeId
 * @param {number} deviceTypeId - Device Type ID
 */
export const getDevicesByType = asyncHandler(async (req, res) => {
  const { deviceTypeId } = req.params;

  const devices = await DeviceService.getDevicesByType(deviceTypeId);

  logger.info(
    `Retrieved ${devices.length} devices for type ID: ${deviceTypeId}`
  );

  return ApiResponse.success(res, devices, "Devices retrieved successfully");
});

/**
 * Get devices by status
 * @route GET /api/devices/status/:status
 * @param {string} status - Device status
 */
export const getDevicesByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;

  const devices = await DeviceService.getDevicesByStatus(status);

  logger.info(`Retrieved ${devices.length} devices with status: ${status}`);

  return ApiResponse.success(res, devices, "Devices retrieved successfully");
});

/**
 * Assign device to room
 * @route PUT /api/devices/:id/assign
 * @param {number} id - Device ID
 * @body {number} roomId - Room ID to assign
 */
export const assignDeviceToRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roomId } = req.body;

  if (!roomId) {
    return ApiResponse.error(
      res,
      "Room ID is required",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const device = await DeviceService.assignDeviceToRoom(id, roomId);

  logger.info(`Assigned device ${id} to room ${roomId}`);

  return ApiResponse.success(res, device, "Device assigned successfully");
});

/**
 * Remove device from room
 * @route PUT /api/devices/:id/remove
 * @param {number} id - Device ID
 */
export const removeDeviceFromRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const device = await DeviceService.removeDeviceFromRoom(id);

  logger.info(`Removed device ${id} from room`);

  return ApiResponse.success(
    res,
    device,
    "Device removed from room successfully"
  );
});

/**
 * Get device statistics
 * @route GET /api/devices/statistics/summary
 */
export const getDeviceStatistics = asyncHandler(async (req, res) => {
  const stats = await DeviceService.getDeviceStatistics();

  logger.info("Retrieved device statistics");

  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});
