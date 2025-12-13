import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../constants/index.js";
import { staffSchema } from "../schemas/staff.js";
import StaffService from "../services/staff.service.js";
import logger from "../utils/logger.js";

/**
 * Get all staff with pagination and filtering
 * @route GET /api/staff
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} position - Filter by position
 * @query {string} status - Filter by status
 * @query {number} minSalary - Minimum salary
 * @query {number} maxSalary - Maximum salary
 * @query {string} search - Search by name or phone
 */
export const getAllStaff = asyncHandler(async (req, res) => {
  const { page, limit, position, status, minSalary, maxSalary, search } =
    req.query;

  const result = await StaffService.getAllStaff({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    position,
    status,
    minSalary: minSalary ? parseFloat(minSalary) : undefined,
    maxSalary: maxSalary ? parseFloat(maxSalary) : undefined,
    search,
  });

  logger.info(`Retrieved ${result.data.length} staff members`);

  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination.page,
    result.pagination.limit,
    result.pagination.total,
    "Staff retrieved successfully"
  );
});

/**
 * Get staff by ID
 * @route GET /api/staff/:id
 * @param {number} id - Staff ID
 */
export const getStaffById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const staff = await StaffService.getStaffById(id);

  logger.info(`Retrieved staff with ID: ${id}`);

  return ApiResponse.success(res, staff, "Staff retrieved successfully");
});

/**
 * Create new staff with account
 * @route POST /api/staff
 * @body {object} staffData - Staff information
 */
export const createStaff = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = staffSchema.validate(req.body, {
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

  const staff = await StaffService.createStaff(req.body);

  logger.info(`Created new staff: ${staff.StaffName} (ID: ${staff.StaffId})`);

  return ApiResponse.success(
    res,
    staff,
    SUCCESS_MESSAGES.CREATED,
    HTTP_STATUS.CREATED
  );
});

/**
 * Update staff information
 * @route PUT /api/staff/:id
 * @param {number} id - Staff ID
 * @body {object} staffData - Updated staff information
 */
export const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request body
  const { error } = staffSchema.validate(req.body, {
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

  const staff = await StaffService.updateStaff(id, req.body);

  logger.info(`Updated staff with ID: ${id}`);

  return ApiResponse.success(res, staff, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Soft delete staff
 * @route DELETE /api/staff/:id
 * @param {number} id - Staff ID
 */
export const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await StaffService.deleteStaff(id);

  logger.info(`Soft deleted staff with ID: ${id}`);

  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get staff statistics
 * @route GET /api/staff/statistics/summary
 */
export const getStaffStatistics = asyncHandler(async (req, res) => {
  const stats = await StaffService.getStaffStatistics();

  logger.info("Retrieved staff statistics");

  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});

/**
 * Get positions list with counts
 * @route GET /api/staff/positions/list
 */
export const getPositions = asyncHandler(async (req, res) => {
  const positions = await StaffService.getPositions();

  logger.info("Retrieved positions list");

  return ApiResponse.success(
    res,
    positions,
    "Positions retrieved successfully"
  );
});
