import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";
import {
  createEventTypeSchema,
  updateEventTypeSchema,
} from "../schemas/eventType.js";
import {
  getAllEventTypes,
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType,
} from "../services/eventType.service.js";

/**
 * Get all event types with pagination
 * @route GET /api/event-type
 * @access Private (Admin, Staff)
 */
export const getAllEventType = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await getAllEventTypes(page, limit);

  logger.info(
    `Retrieved ${result.data.length} event types (page ${result.pagination.page})`
  );
  logger.info(
    `Retrieved event types - Page: ${result.pagination.page}, Limit: ${result.pagination.limit}, Total: ${result.pagination.total}`
  );

  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Event types retrieved successfully"
  );
});

/**
 * Get event type by ID
 * @route GET /api/event-type/:id
 * @access Public
 */
export const getEventTypeByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eventType = await getEventTypeById(id);

  logger.info(`Retrieved event type with ID: ${id}`);
  return ApiResponse.success(
    res,
    eventType,
    "Event type retrieved successfully"
  );
});

/**
 * Create new event type
 * @route POST /api/event-type
 * @access Private (Admin)
 */
export const createEventTypeController = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createEventTypeSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const result = await createEventType(value);

  logger.info(`Event type created with ID: ${result.EventTypeId}`);
  return ApiResponse.created(res, result, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update event type
 * @route PUT /api/event-type/:id or PUT /api/event-type/update
 * @access Private (Admin)
 */
export const updateEventTypeController = asyncHandler(async (req, res) => {
  // Handle both RESTful (:id) and legacy (body.EventTypeId) formats
  const eventTypeId = req.params.id || req.body.EventTypeId;

  if (!eventTypeId) {
    throw new AppError("Event Type ID is required", 400);
  }

  // Validate request body
  const { error, value } = updateEventTypeSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const result = await updateEventType(eventTypeId, value);

  logger.info(`Event type updated: ${eventTypeId}`);
  return ApiResponse.success(res, result, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete event type (soft delete)
 * @route DELETE /api/event-type/:id
 * @access Private (Admin)
 */
export const deleteEventTypeController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteEventType(id);

  logger.info(`Event type soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});
