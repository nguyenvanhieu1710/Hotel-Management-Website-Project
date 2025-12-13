import { executeMysqlQuery } from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all event types
 * @route GET /api/event-type
 * @access Public
 */
export const getAllEventType = asyncHandler(async (req, res) => {
  const eventTypes = await executeMysqlQuery(
    "SELECT * FROM EventType WHERE Deleted = 0"
  );

  logger.info(`Retrieved ${eventTypes.length} event types`);
  return ApiResponse.success(
    res,
    eventTypes,
    "Event types retrieved successfully"
  );
});

/**
 * Get event type by ID
 * @route GET /api/event-type/:id
 * @access Public
 */
export const getEventTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [eventType] = await executeMysqlQuery(
    "SELECT * FROM EventType WHERE EventTypeID = ? AND Deleted = 0",
    [id]
  );

  if (!eventType) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

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
export const createEventType = asyncHandler(async (req, res) => {
  const { EventTypeName, Description } = req.body;

  const result = await executeMysqlQuery(
    "INSERT INTO EventType (EventTypeName, Description, Deleted) VALUES (?, ?, 0)",
    [EventTypeName, Description]
  );

  logger.info(`Event type created with ID: ${result.insertId}`);
  return ApiResponse.created(
    res,
    { EventTypeID: result.insertId, EventTypeName, Description },
    SUCCESS_MESSAGES.CREATED
  );
});

/**
 * Update event type
 * @route PUT /api/event-type/:id
 * @access Private (Admin)
 */
export const updateEventType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { EventTypeName, Description } = req.body;

  const result = await executeMysqlQuery(
    "UPDATE EventType SET EventTypeName = ?, Description = ? WHERE EventTypeID = ? AND Deleted = 0",
    [EventTypeName, Description, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  logger.info(`Event type updated: ${id}`);
  return ApiResponse.success(
    res,
    { EventTypeID: id, EventTypeName, Description },
    SUCCESS_MESSAGES.UPDATED
  );
});

/**
 * Delete event type (soft delete)
 * @route DELETE /api/event-type/:id
 * @access Private (Admin)
 */
export const deleteEventType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await executeMysqlQuery(
    "UPDATE EventType SET Deleted = 1 WHERE EventTypeID = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  logger.info(`Event type soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});
