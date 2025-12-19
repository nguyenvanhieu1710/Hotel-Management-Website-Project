import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all event types with pagination
 */
export const getAllEventTypes = async (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  // Get total count
  const [countResult] = await executeMysqlQuery(
    "SELECT COUNT(*) as total FROM EventType WHERE Deleted = 0"
  );
  const total = countResult.total;

  // Get paginated data
  const eventTypes = await executeMysqlQuery(
    "SELECT * FROM EventType WHERE Deleted = 0 ORDER BY EventTypeId DESC LIMIT ? OFFSET ?",
    [limitNum, offset]
  );

  return {
    data: eventTypes,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get event type by ID
 */
export const getEventTypeById = async (id) => {
  const [eventType] = await executeMysqlQuery(
    "SELECT * FROM EventType WHERE EventTypeId = ? AND Deleted = 0",
    [id]
  );

  if (!eventType) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  return eventType;
};

/**
 * Check if event type name exists
 */
export const checkEventTypeNameExists = async (
  eventTypeName,
  excludeId = null
) => {
  let query =
    "SELECT EventTypeId FROM EventType WHERE EventTypeName = ? AND Deleted = 0";
  let params = [eventTypeName];

  if (excludeId) {
    query += " AND EventTypeId != ?";
    params.push(excludeId);
  }

  const [existingEventType] = await executeMysqlQuery(query, params);
  return !!existingEventType;
};

/**
 * Create new event type
 */
export const createEventType = async (eventTypeData) => {
  const { EventTypeName, Description } = eventTypeData;

  // Check if event type name already exists
  const nameExists = await checkEventTypeNameExists(EventTypeName);
  if (nameExists) {
    throw new AppError("Event Type Name already exists", 400);
  }

  const result = await executeMysqlQuery(
    "INSERT INTO EventType (EventTypeName, Description, Deleted) VALUES (?, ?, 0)",
    [EventTypeName, Description]
  );

  return {
    EventTypeId: result.insertId,
    EventTypeName,
    Description,
  };
};

/**
 * Update event type
 */
export const updateEventType = async (eventTypeId, eventTypeData) => {
  const { EventTypeName, Description } = eventTypeData;

  // Check if event type exists
  const [existingEventType] = await executeMysqlQuery(
    "SELECT EventTypeId FROM EventType WHERE EventTypeId = ? AND Deleted = 0",
    [eventTypeId]
  );

  if (!existingEventType) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  // Check if new event type name already exists (excluding current record)
  if (EventTypeName) {
    const nameExists = await checkEventTypeNameExists(
      EventTypeName,
      eventTypeId
    );
    if (nameExists) {
      throw new AppError("Event Type Name already exists", 400);
    }
  }

  // Build dynamic update query
  const updateFields = [];
  const updateValues = [];

  if (EventTypeName !== undefined) {
    updateFields.push("EventTypeName = ?");
    updateValues.push(EventTypeName);
  }

  if (Description !== undefined) {
    updateFields.push("Description = ?");
    updateValues.push(Description);
  }

  if (updateFields.length === 0) {
    throw new AppError("No fields to update", 400);
  }

  updateValues.push(eventTypeId);

  const result = await executeMysqlQuery(
    `UPDATE EventType SET ${updateFields.join(
      ", "
    )} WHERE EventTypeId = ? AND Deleted = 0`,
    updateValues
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  // Get updated record
  const [updatedEventType] = await executeMysqlQuery(
    "SELECT * FROM EventType WHERE EventTypeId = ? AND Deleted = 0",
    [eventTypeId]
  );

  return updatedEventType;
};

/**
 * Delete event type (soft delete)
 */
export const deleteEventType = async (eventTypeId) => {
  const result = await executeMysqlQuery(
    "UPDATE EventType SET Deleted = 1 WHERE EventTypeId = ?",
    [eventTypeId]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
  }

  return true;
};

/**
 * Check if event type exists
 */
export const checkEventTypeExists = async (eventTypeId) => {
  const [eventType] = await executeMysqlQuery(
    "SELECT EventTypeId FROM EventType WHERE EventTypeId = ? AND Deleted = 0",
    [eventTypeId]
  );

  return !!eventType;
};
