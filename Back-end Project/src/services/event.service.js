import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Event Service
 * Handles all business logic for event management
 */
class EventService {
  /**
   * Get all events with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {number} options.eventTypeId - Filter by event type
   * @param {string} options.status - Filter by status
   * @param {number} options.minPrice - Minimum price filter
   * @param {number} options.maxPrice - Maximum price filter
   * @param {string} options.search - Search by name
   * @returns {Promise<Object>} Paginated events with metadata
   */
  async getAllEvents(options = {}) {
    const {
      page = 1,
      limit = 10,
      eventTypeId,
      status,
      minPrice,
      maxPrice,
      search,
    } = options;

    const offset = (page - 1) * limit;
    let whereConditions = ["e.Deleted = 0"];
    let params = [];

    // Build WHERE conditions
    if (eventTypeId) {
      whereConditions.push("e.EventTypeId = ?");
      params.push(eventTypeId);
    }

    if (status) {
      whereConditions.push("e.Status = ?");
      params.push(status);
    }

    if (minPrice) {
      whereConditions.push("e.Price >= ?");
      params.push(minPrice);
    }

    if (maxPrice) {
      whereConditions.push("e.Price <= ?");
      params.push(maxPrice);
    }

    if (search) {
      whereConditions.push("(e.EventName LIKE ? OR e.Description LIKE ?)");
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Event e
      WHERE ${whereClause}
    `;
    const [countResult] = await executeMysqlQuery(countQuery, params);
    const total = countResult.total;

    // Get paginated data with event type info
    const dataQuery = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE ${whereClause}
      ORDER BY e.OrganizationDay DESC
      LIMIT ? OFFSET ?
    `;
    const events = await executeMysqlQuery(dataQuery, [
      ...params,
      limit,
      offset,
    ]);

    return {
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>} Event details
   */
  async getEventById(eventId) {
    const query = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE e.EventId = ? AND e.Deleted = 0
    `;
    const [event] = await executeMysqlQuery(query, [eventId]);

    if (!event) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event"), 404);
    }

    return event;
  }

  /**
   * Get events by type
   * @param {number} eventTypeId - Event type ID
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Events of specified type
   */
  async getEventsByType(eventTypeId, limit = 10) {
    const query = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE e.EventTypeId = ? AND e.Deleted = 0
      ORDER BY e.OrganizationDay DESC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [eventTypeId, limit]);
  }

  /**
   * Get upcoming events
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Upcoming events
   */
  async getUpcomingEvents(limit = 10) {
    const query = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE e.OrganizationDay >= CURDATE() 
        AND e.Deleted = 0 
        AND e.Status = 'Active'
      ORDER BY e.OrganizationDay ASC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [limit]);
  }

  /**
   * Search events
   * @param {string} searchTerm - Search term
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Matching events
   */
  async searchEvents(searchTerm, limit = 10) {
    const query = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE (e.EventName LIKE ? OR e.Description LIKE ?)
        AND e.Deleted = 0
      ORDER BY e.OrganizationDay DESC
      LIMIT ?
    `;

    const searchPattern = `%${searchTerm}%`;
    return await executeMysqlQuery(query, [
      searchPattern,
      searchPattern,
      limit,
    ]);
  }

  /**
   * Create new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  async createEvent(eventData) {
    const {
      EventName,
      EventTypeId,
      EventImage,
      OrganizationDay,
      StartTime,
      EndTime,
      OrganizationLocation,
      Price,
      Status = "Active",
      Description,
    } = eventData;

    // Validate event type exists
    await this.validateEventTypeExists(EventTypeId);

    // Validate price
    if (Price && Price < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    // Validate dates and times
    this.validateEventDateTime(OrganizationDay, StartTime, EndTime);

    // Insert event
    const insertQuery = `
      INSERT INTO Event 
      (EventName, EventTypeId, EventImage, OrganizationDay, StartTime, EndTime, 
       OrganizationLocation, Price, Status, Description, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      EventName,
      EventTypeId,
      EventImage,
      OrganizationDay,
      StartTime,
      EndTime,
      OrganizationLocation,
      Price,
      Status,
      Description,
    ]);

    logger.info(`Event created with ID: ${result.insertId}`);
    return await this.getEventById(result.insertId);
  }

  /**
   * Update event
   * @param {number} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  async updateEvent(eventId, eventData) {
    // Check if event exists
    const existingEvent = await this.getEventById(eventId);

    const {
      EventName,
      EventTypeId,
      EventImage,
      OrganizationDay,
      StartTime,
      EndTime,
      OrganizationLocation,
      Price,
      Status,
      Description,
    } = eventData;

    // Validate event type exists if provided
    if (EventTypeId) {
      await this.validateEventTypeExists(EventTypeId);
    }

    // Validate price if provided
    if (Price !== undefined && Price < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    // Validate dates and times if provided
    if (OrganizationDay || StartTime || EndTime) {
      this.validateEventDateTime(
        OrganizationDay || existingEvent.OrganizationDay,
        StartTime || existingEvent.StartTime,
        EndTime || existingEvent.EndTime
      );
    }

    // Update event
    const updateQuery = `
      UPDATE Event
      SET EventName = ?, EventTypeId = ?, EventImage = ?, OrganizationDay = ?,
          StartTime = ?, EndTime = ?, OrganizationLocation = ?, Price = ?,
          Status = ?, Description = ?
      WHERE EventId = ?
    `;
    await executeMysqlQuery(updateQuery, [
      EventName || existingEvent.EventName,
      EventTypeId || existingEvent.EventTypeId,
      EventImage !== undefined ? EventImage : existingEvent.EventImage,
      OrganizationDay || existingEvent.OrganizationDay,
      StartTime || existingEvent.StartTime,
      EndTime || existingEvent.EndTime,
      OrganizationLocation || existingEvent.OrganizationLocation,
      Price !== undefined ? Price : existingEvent.Price,
      Status || existingEvent.Status,
      Description !== undefined ? Description : existingEvent.Description,
      eventId,
    ]);

    logger.info(`Event updated: ${eventId}`);
    return await this.getEventById(eventId);
  }

  /**
   * Update event status
   * @param {number} eventId - Event ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated event
   */
  async updateEventStatus(eventId, status) {
    // Validate status
    const validStatuses = ["Active", "Inactive", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const query = `
      UPDATE Event
      SET Status = ?
      WHERE EventId = ? AND Deleted = 0
    `;

    const result = await executeMysqlQuery(query, [status, eventId]);

    if (result.affectedRows === 0) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event"), 404);
    }

    logger.info(`Event ${eventId} status updated to: ${status}`);
    return await this.getEventById(eventId);
  }

  /**
   * Delete event (soft delete)
   * @param {number} eventId - Event ID
   * @returns {Promise<void>}
   */
  async deleteEvent(eventId) {
    // Check if event exists
    await this.getEventById(eventId);

    // Check if event has bookings
    const bookingQuery = `
      SELECT COUNT(*) as count
      FROM EventVotes
      WHERE EventId = ? AND Deleted = 0
    `;
    const [result] = await executeMysqlQuery(bookingQuery, [eventId]);

    if (result.count > 0) {
      throw new AppError(
        "Cannot delete event with existing bookings. Please cancel bookings first.",
        400
      );
    }

    // Soft delete event
    const query = `
      UPDATE Event
      SET Deleted = 1
      WHERE EventId = ?
    `;

    await executeMysqlQuery(query, [eventId]);
    logger.info(`Event soft deleted: ${eventId}`);
  }

  /**
   * Get event statistics
   * @returns {Promise<Object>} Event statistics
   */
  async getEventStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalEvents,
        SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) as activeEvents,
        SUM(CASE WHEN Status = 'Inactive' THEN 1 ELSE 0 END) as inactiveEvents,
        SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledEvents,
        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as completedEvents,
        AVG(Price) as averagePrice,
        MIN(Price) as minPrice,
        MAX(Price) as maxPrice
      FROM Event
      WHERE Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  /**
   * Get events by price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Events in price range
   */
  async getEventsByPriceRange(minPrice, maxPrice, limit = 10) {
    const query = `
      SELECT 
        e.*,
        et.EventTypeName
      FROM Event e
      LEFT JOIN EventType et ON e.EventTypeId = et.EventTypeId
      WHERE e.Price BETWEEN ? AND ? AND e.Deleted = 0
      ORDER BY e.Price ASC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [minPrice, maxPrice, limit]);
  }

  // ==================== Validation Methods ====================

  /**
   * Validate event type exists
   * @param {number} eventTypeId - Event type ID
   * @returns {Promise<void>}
   */
  async validateEventTypeExists(eventTypeId) {
    const query =
      "SELECT EventTypeId FROM EventType WHERE EventTypeId = ? AND Deleted = 0";
    const [eventType] = await executeMysqlQuery(query, [eventTypeId]);

    if (!eventType) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Event Type"), 404);
    }
  }

  /**
   * Validate event date and time
   * @param {string} organizationDay - Organization day
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @returns {void}
   */
  validateEventDateTime(organizationDay, startTime, endTime) {
    const eventDate = new Date(organizationDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      throw new AppError("Event date cannot be in the past", 400);
    }

    if (startTime && endTime) {
      const start = new Date(`2000-01-01 ${startTime}`);
      const end = new Date(`2000-01-01 ${endTime}`);

      if (end <= start) {
        throw new AppError("End time must be after start time", 400);
      }
    }
  }
}

export default new EventService();
