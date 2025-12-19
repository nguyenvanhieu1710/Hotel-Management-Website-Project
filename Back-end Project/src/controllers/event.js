import EventService from "../services/event.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";
import { createEventSchema, updateEventSchema } from "../schemas/event.js";

/**
 * Get all events with pagination and filters
 * @route GET /api/event
 * @access Public
 */
export const getEvents = asyncHandler(async (req, res) => {
  const { page, limit, eventTypeId, status, minPrice, maxPrice, search } =
    req.query;

  const result = await EventService.getAllEvents({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    eventTypeId,
    status,
    minPrice,
    maxPrice,
    search,
  });

  logger.info(`Retrieved ${result.data.length} events`);
  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Events retrieved successfully"
  );
});

/**
 * Get event by ID
 * @route GET /api/event/:id
 * @access Public
 */
export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await EventService.getEventById(id);

  logger.info(`Retrieved event with ID: ${id}`);
  return ApiResponse.success(res, event, "Event retrieved successfully");
});

/**
 * Create new event
 * @route POST /api/event
 * @access Private (Admin)
 */
export const createEvent = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createEventSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const event = await EventService.createEvent(value);

  logger.info(`Event created with ID: ${event.EventId}`);
  return ApiResponse.created(res, event, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update event
 * @route PUT /api/event/:id or PUT /api/event/update
 * @access Private (Admin)
 */
export const updateEvent = asyncHandler(async (req, res) => {
  // Handle both RESTful (:id) and legacy (body.EventId) formats
  const eventId = req.params.id || req.body.EventId;

  if (!eventId) {
    throw new AppError("Event ID is required", 400);
  }

  // Validate request body
  const { error, value } = updateEventSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const event = await EventService.updateEvent(eventId, value);

  logger.info(`Event updated: ${eventId}`);
  return ApiResponse.success(res, event, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete event (soft delete)
 * @route DELETE /api/event/:id
 * @access Private (Admin)
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await EventService.deleteEvent(id);

  logger.info(`Event soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get upcoming events
 * @route GET /api/event/upcoming
 * @access Public
 */
export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const events = await EventService.getUpcomingEvents(parseInt(limit) || 10);

  logger.info(`Retrieved ${events.length} upcoming events`);
  return ApiResponse.success(
    res,
    events,
    "Upcoming events retrieved successfully"
  );
});

/**
 * Get events by type
 * @route GET /api/event/type/:eventTypeId
 * @access Public
 */
export const getEventsByType = asyncHandler(async (req, res) => {
  const { eventTypeId } = req.params;
  const { limit } = req.query;

  const events = await EventService.getEventsByType(
    eventTypeId,
    parseInt(limit) || 10
  );

  logger.info(`Retrieved ${events.length} events for type: ${eventTypeId}`);
  return ApiResponse.success(
    res,
    events,
    "Events by type retrieved successfully"
  );
});

/**
 * Get event statistics
 * @route GET /api/event/statistics/summary
 * @access Private (Admin, Staff)
 */
export const getEventStatistics = asyncHandler(async (req, res) => {
  const stats = await EventService.getEventStatistics();

  logger.info("Retrieved event statistics");
  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});

/**
 * Update event status
 * @route PUT /api/event/:id/status
 * @access Private (Admin, Staff)
 */
export const updateEventStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const event = await EventService.updateEventStatus(id, status);

  logger.info(`Event ${id} status updated to: ${status}`);
  return ApiResponse.success(res, event, "Status updated successfully");
});
