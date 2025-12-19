import deviceTypeService from "../services/deviceType.service.js";
import {
  createDeviceTypeSchema,
  updateDeviceTypeSchema,
} from "../schemas/deviceType.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Get all device types with pagination
 */
export const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const filters = {};
  if (search) {
    filters.search = search;
  }

  const result = await deviceTypeService.getAllDeviceTypes(
    page,
    limit,
    filters
  );

  logger.info(
    `Retrieved device types - Page: ${page}, Limit: ${limit}, Total: ${result.pagination.total}`
  );

  return ApiResponse.paginated(
    res,
    result.deviceTypes,
    result.pagination,
    "Device types retrieved successfully"
  );
});

/**
 * Get device type by ID
 */
export const getById = asyncHandler(async (req, res) => {
  const deviceTypeId = parseInt(req.params.id);

  if (!deviceTypeId || isNaN(deviceTypeId)) {
    return ApiResponse.error(
      res,
      "Invalid device type ID",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const deviceType = await deviceTypeService.getDeviceTypeById(deviceTypeId);

  logger.info(`Retrieved device type with ID: ${deviceTypeId}`);
  return ApiResponse.success(
    res,
    deviceType,
    "Device type retrieved successfully"
  );
});

/**
 * Create new device type
 */
export const createDevice = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createDeviceTypeSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return ApiResponse.error(
      res,
      errorMessages.join(", "),
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const deviceType = await deviceTypeService.createDeviceType(value);

  logger.info(
    `Device type created successfully with ID: ${deviceType.DeviceTypeId}`
  );
  return ApiResponse.created(
    res,
    deviceType,
    "Device type created successfully"
  );
});

/**
 * Update device type
 */
export const updateDevice = asyncHandler(async (req, res) => {
  const deviceTypeId = parseInt(req.params.id);

  if (!deviceTypeId || isNaN(deviceTypeId)) {
    return ApiResponse.error(
      res,
      "Invalid device type ID",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Validate request body
  const { error, value } = updateDeviceTypeSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return ApiResponse.error(
      res,
      errorMessages.join(", "),
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const deviceType = await deviceTypeService.updateDeviceType(
    deviceTypeId,
    value
  );

  logger.info(`Device type updated successfully with ID: ${deviceTypeId}`);
  return ApiResponse.success(
    res,
    deviceType,
    "Device type updated successfully"
  );
});

/**
 * Delete device type (soft delete)
 */
export const deleteDevice = asyncHandler(async (req, res) => {
  const deviceTypeId = parseInt(req.params.id);

  if (!deviceTypeId || isNaN(deviceTypeId)) {
    return ApiResponse.error(
      res,
      "Invalid device type ID",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await deviceTypeService.deleteDeviceType(deviceTypeId);

  logger.info(`Device type deleted successfully with ID: ${deviceTypeId}`);
  return ApiResponse.success(res, null, "Device type deleted successfully");
});
