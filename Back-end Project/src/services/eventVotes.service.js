import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all event votes with pagination
 */
export const getAllEventVotes = async (page = 1, limit = 10, filters = {}) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  let whereConditions = ["ev.Deleted = 0"];
  let params = [];

  // Add filters
  if (filters.eventId) {
    whereConditions.push("ev.EventId = ?");
    params.push(filters.eventId);
  }

  if (filters.userId) {
    whereConditions.push("ev.UserId = ?");
    params.push(filters.userId);
  }

  const whereClause = whereConditions.join(" AND ");

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM EventVotes ev
    WHERE ${whereClause}
  `;
  const [countResult] = await executeMysqlQuery(countQuery, params);
  const total = countResult.total;

  // Get paginated data with event and user info
  const dataQuery = `
    SELECT 
      ev.*,
      e.EventName,
      e.OrganizationDay,
      e.Price as EventPrice,
      u.UserName,
      a.Email as UserEmail,
      u.PhoneNumber as UserPhone
    FROM EventVotes ev
    LEFT JOIN Event e ON ev.EventId = e.EventId
    LEFT JOIN Users u ON ev.UserId = u.UserId
    LEFT JOIN Account a ON u.UserId = a.AccountId
    WHERE ${whereClause}
    ORDER BY ev.EventVotesId DESC
    LIMIT ? OFFSET ?
  `;
  const eventVotes = await executeMysqlQuery(dataQuery, [
    ...params,
    limitNum,
    offset,
  ]);

  return {
    data: eventVotes,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get event vote by ID
 */
export const getEventVoteById = async (eventVoteId) => {
  const [eventVote] = await executeMysqlQuery(
    `SELECT 
      ev.*,
      e.EventName,
      e.OrganizationDay,
      e.Price as EventPrice,
      u.UserName,
      a.Email as UserEmail,
      u.PhoneNumber as UserPhone
    FROM EventVotes ev
    LEFT JOIN Event e ON ev.EventId = e.EventId
    LEFT JOIN Users u ON ev.UserId = u.UserId
    LEFT JOIN Account a ON u.UserId = a.AccountId
    WHERE ev.EventVotesId = ? AND ev.Deleted = 0`,
    [eventVoteId]
  );

  if (!eventVote) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  return eventVote;
};

/**
 * Check if event exists and is available
 */
export const validateEventExists = async (eventId) => {
  const [event] = await executeMysqlQuery(
    "SELECT EventId, Status FROM Event WHERE EventId = ? AND Deleted = 0",
    [eventId]
  );

  if (!event) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event"), 404);
  }

  if (event.Status !== "Active") {
    throw new AppError("Event is not available for booking", 400);
  }

  return event;
};

/**
 * Check if user exists
 */
export const validateUserExists = async (userId) => {
  const [user] = await executeMysqlQuery(
    "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0",
    [userId]
  );

  if (!user) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("User"), 404);
  }

  return user;
};

/**
 * Create new event vote
 */
export const createEventVote = async (eventVoteData) => {
  const { EventId, UserId, TotalAmount } = eventVoteData;

  // Validate event exists and is available
  await validateEventExists(EventId);

  // Validate user exists
  await validateUserExists(UserId);

  // Validate total amount
  if (!TotalAmount || TotalAmount <= 0) {
    throw new AppError("Total amount must be greater than 0", 400);
  }

  const result = await executeMysqlQuery(
    "INSERT INTO EventVotes (EventId, UserId, TotalAmount, Deleted) VALUES (?, ?, ?, 0)",
    [EventId, UserId, TotalAmount]
  );

  return {
    EventVotesId: result.insertId,
    EventId,
    UserId,
    TotalAmount,
  };
};

/**
 * Update event vote
 */
export const updateEventVote = async (eventVoteId, eventVoteData) => {
  const { EventId, UserId, TotalAmount } = eventVoteData;

  // Check if event vote exists
  const [existingEventVote] = await executeMysqlQuery(
    "SELECT EventVotesId FROM EventVotes WHERE EventVotesId = ? AND Deleted = 0",
    [eventVoteId]
  );

  if (!existingEventVote) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  // Validate event exists if provided
  if (EventId) {
    await validateEventExists(EventId);
  }

  // Validate user exists if provided
  if (UserId) {
    await validateUserExists(UserId);
  }

  // Validate total amount if provided
  if (TotalAmount !== undefined && TotalAmount <= 0) {
    throw new AppError("Total amount must be greater than 0", 400);
  }

  // Build dynamic update query
  const updateFields = [];
  const updateValues = [];

  if (EventId !== undefined) {
    updateFields.push("EventId = ?");
    updateValues.push(EventId);
  }

  if (UserId !== undefined) {
    updateFields.push("UserId = ?");
    updateValues.push(UserId);
  }

  if (TotalAmount !== undefined) {
    updateFields.push("TotalAmount = ?");
    updateValues.push(TotalAmount);
  }

  if (updateFields.length === 0) {
    throw new AppError("No fields to update", 400);
  }

  updateValues.push(eventVoteId);

  const result = await executeMysqlQuery(
    `UPDATE EventVotes SET ${updateFields.join(
      ", "
    )} WHERE EventVotesId = ? AND Deleted = 0`,
    updateValues
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  // Get updated record
  const [updatedEventVote] = await executeMysqlQuery(
    "SELECT * FROM EventVotes WHERE EventVotesId = ? AND Deleted = 0",
    [eventVoteId]
  );

  return updatedEventVote;
};

/**
 * Delete event vote (soft delete)
 */
export const deleteEventVote = async (eventVoteId) => {
  const result = await executeMysqlQuery(
    "UPDATE EventVotes SET Deleted = 1 WHERE EventVotesId = ?",
    [eventVoteId]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Vote"), 404);
  }

  return true;
};

/**
 * Get event votes by event ID
 */
export const getEventVotesByEventId = async (eventId, limit = 10) => {
  const eventVotes = await executeMysqlQuery(
    `SELECT 
      ev.*,
      u.UserName,
      a.Email as UserEmail
    FROM EventVotes ev
    LEFT JOIN Users u ON ev.UserId = u.UserId
    LEFT JOIN Account a ON u.UserId = a.AccountId
    WHERE ev.EventId = ? AND ev.Deleted = 0
    ORDER BY ev.EventVotesId DESC
    LIMIT ?`,
    [eventId, limit]
  );

  return eventVotes;
};

/**
 * Get event votes by user ID
 */
export const getEventVotesByUserId = async (userId, limit = 10) => {
  const eventVotes = await executeMysqlQuery(
    `SELECT 
      ev.*,
      e.EventName,
      e.OrganizationDay
    FROM EventVotes ev
    LEFT JOIN Event e ON ev.EventId = e.EventId
    WHERE ev.UserId = ? AND ev.Deleted = 0
    ORDER BY ev.EventVotesId DESC
    LIMIT ?`,
    [userId, limit]
  );

  return eventVotes;
};

/**
 * Get event vote statistics
 */
export const getEventVoteStatistics = async () => {
  const [stats] = await executeMysqlQuery(`
    SELECT 
      COUNT(*) as totalEventVotes,
      SUM(TotalAmount) as totalRevenue,
      AVG(TotalAmount) as averageAmount,
      MIN(TotalAmount) as minAmount,
      MAX(TotalAmount) as maxAmount
    FROM EventVotes
    WHERE Deleted = 0
  `);

  return stats;
};
