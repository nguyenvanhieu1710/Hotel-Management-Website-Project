import { executeMysqlQuery } from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all event votes with event and user info
 * @route GET /api/event-votes
 * @access Private (Admin, Staff)
 */
export const getAllEventVotes = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.query;

  let query = `
    SELECT 
      ev.*,
      e.EventName,
      e.OrganizationDay,
      u.FullName as UserName,
      u.Email as UserEmail
    FROM EventVotes ev
    LEFT JOIN Event e ON ev.EventId = e.EventId
    LEFT JOIN Users u ON ev.UserId = u.UserId
    WHERE ev.Deleted = 0
  `;
  const params = [];

  if (eventId) {
    query += " AND ev.EventId = ?";
    params.push(eventId);
  }

  if (userId) {
    query += " AND ev.UserId = ?";
    params.push(userId);
  }

  query += " ORDER BY ev.EventVotesId DESC";

  const eventVotes = await executeMysqlQuery(query, params);

  logger.info(`Retrieved ${eventVotes.length} event votes`);
  return ApiResponse.success(
    res,
    eventVotes,
    "Event votes retrieved successfully"
  );
});

/**
 * Get event vote by ID
 * @route GET /api/event-votes/:id
 * @access Private (Admin, Staff, Owner)
 */
export const getEventVotesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [eventVotes] = await executeMysqlQuery(
    `SELECT 
      ev.*,
      e.EventName,
      e.OrganizationDay,
      e.Price as EventPrice,
      u.FullName as UserName,
      u.Email as UserEmail,
      u.PhoneNumber as UserPhone
    FROM EventVotes ev
    LEFT JOIN Event e ON ev.EventId = e.EventId
    LEFT JOIN Users u ON ev.UserId = u.UserId
    WHERE ev.EventVotesId = ? AND ev.Deleted = 0`,
    [id]
  );

  if (!eventVotes) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  logger.info(`Retrieved event vote with ID: ${id}`);
  return ApiResponse.success(
    res,
    eventVotes,
    "Event vote retrieved successfully"
  );
});

/**
 * Create new event vote (event booking)
 * @route POST /api/event-votes
 * @access Private (Customer, Admin)
 */
export const createEventVotes = asyncHandler(async (req, res) => {
  const { EventId, UserId, TotalAmount } = req.body;

  // Validate event exists
  const [event] = await executeMysqlQuery(
    "SELECT EventId, Status FROM Event WHERE EventId = ? AND Deleted = 0",
    [EventId]
  );

  if (!event) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event"), 404);
  }

  if (event.Status !== "Active") {
    throw new AppError("Event is not available for booking", 400);
  }

  // Validate user exists
  const [user] = await executeMysqlQuery(
    "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0",
    [UserId]
  );

  if (!user) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("User"), 404);
  }

  // Validate total amount
  if (!TotalAmount || TotalAmount <= 0) {
    throw new AppError("Total amount must be greater than 0", 400);
  }

  const result = await executeMysqlQuery(
    "INSERT INTO EventVotes (EventId, UserId, TotalAmount, Deleted) VALUES (?, ?, ?, 0)",
    [EventId, UserId, TotalAmount]
  );

  logger.info(`Event vote created with ID: ${result.insertId}`);
  return ApiResponse.created(
    res,
    { EventVotesId: result.insertId },
    SUCCESS_MESSAGES.CREATED
  );
});

/**
 * Update event vote
 * @route PUT /api/event-votes/:id
 * @access Private (Admin)
 */
export const updateEventVotes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { EventId, UserId, TotalAmount } = req.body;

  // Validate event exists if provided
  if (EventId) {
    const [event] = await executeMysqlQuery(
      "SELECT EventId FROM Event WHERE EventId = ? AND Deleted = 0",
      [EventId]
    );

    if (!event) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event"), 404);
    }
  }

  // Validate user exists if provided
  if (UserId) {
    const [user] = await executeMysqlQuery(
      "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0",
      [UserId]
    );

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("User"), 404);
    }
  }

  // Validate total amount if provided
  if (TotalAmount !== undefined && TotalAmount <= 0) {
    throw new AppError("Total amount must be greater than 0", 400);
  }

  const result = await executeMysqlQuery(
    `UPDATE EventVotes
    SET EventId = ?, UserId = ?, TotalAmount = ?
    WHERE EventVotesId = ? AND Deleted = 0`,
    [EventId, UserId, TotalAmount, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  logger.info(`Event vote updated: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete event vote (soft delete)
 * @route DELETE /api/event-votes/:id
 * @access Private (Admin)
 */
export const deleteEventVotes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await executeMysqlQuery(
    "UPDATE EventVotes SET Deleted = 1 WHERE EventVotesId = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  logger.info(`Event vote soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});
