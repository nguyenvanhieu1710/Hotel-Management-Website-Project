import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Service Votes Service
 * Handles all service votes-related business logic
 */
class ServiceVotesService {
  /**
   * Get all service votes with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Service votes data with pagination info
   */
  async getAllServiceVotes(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["sv.Deleted = 0"];
    let queryParams = [];

    if (filters.serviceId) {
      whereConditions.push("sv.ServiceId = ?");
      queryParams.push(filters.serviceId);
    }

    if (filters.userId) {
      whereConditions.push("sv.UserId = ?");
      queryParams.push(filters.userId);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ServiceVotes sv WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data with joins
    const query = `
      SELECT 
        sv.*,
        s.ServiceName,
        s.Price as ServicePrice,
        u.UserName
      FROM ServiceVotes sv
      LEFT JOIN Service s ON sv.ServiceId = s.ServiceId
      LEFT JOIN Users u ON sv.UserId = u.UserId
      WHERE ${whereClause}
      ORDER BY sv.ServiceVotesId DESC
      LIMIT ? OFFSET ?
    `;

    const serviceVotes = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(
      `Retrieved ${serviceVotes.length} service votes (page ${page})`
    );

    return {
      serviceVotes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get service votes by ID
   * @param {Number} serviceVotesId - Service votes ID
   * @returns {Promise<Object>} - Service votes data
   */
  async getServiceVotesById(serviceVotesId) {
    const query = `
      SELECT 
        sv.*,
        s.ServiceName,
        s.Price as ServicePrice,
        u.UserName
      FROM ServiceVotes sv
      LEFT JOIN Service s ON sv.ServiceId = s.ServiceId
      LEFT JOIN Users u ON sv.UserId = u.UserId
      WHERE sv.ServiceVotesId = ? AND sv.Deleted = 0
    `;
    const [serviceVotes] = await executeMysqlQuery(query, [serviceVotesId]);

    if (!serviceVotes) {
      throw new AppError(
        ERROR_MESSAGES.NOT_FOUND("Service votes"),
        HTTP_STATUS.NOT_FOUND
      );
    }

    return serviceVotes;
  }

  /**
   * Create new service votes
   * @param {Object} serviceVotesData - Service votes data
   * @returns {Promise<Object>} - Created service votes
   */
  async createServiceVotes(serviceVotesData) {
    const { ServiceId, UserId, Quantity, TotalAmount } = serviceVotesData;

    // Validate service exists
    const serviceExists = await this.validateService(ServiceId);
    if (!serviceExists) {
      throw new AppError("Service does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    // Validate user exists
    const userExists = await this.validateUser(UserId);
    if (!userExists) {
      throw new AppError("User does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    // Validate quantity
    if (!Quantity || Quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Calculate total amount if not provided
    let calculatedTotalAmount = TotalAmount;
    if (!calculatedTotalAmount) {
      const service = await this.getServiceById(ServiceId);
      calculatedTotalAmount = service.Price * Quantity;
    }

    // Create service votes
    const insertQuery = `
      INSERT INTO ServiceVotes (ServiceId, UserId, Quantity, TotalAmount, Deleted)
      VALUES (?, ?, ?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      ServiceId,
      UserId,
      Quantity,
      calculatedTotalAmount,
    ]);

    logger.info(`Created service votes: ID ${result.insertId}`);

    return {
      ServiceVotesId: result.insertId,
      ServiceId,
      UserId,
      Quantity,
      TotalAmount: calculatedTotalAmount,
      Deleted: false,
    };
  }

  /**
   * Update service votes
   * @param {Number} serviceVotesId - Service votes ID
   * @param {Object} serviceVotesData - Updated service votes data
   * @returns {Promise<Object>} - Updated service votes
   */
  async updateServiceVotes(serviceVotesId, serviceVotesData) {
    // Check if service votes exists
    await this.getServiceVotesById(serviceVotesId);

    const { ServiceId, UserId, Quantity, TotalAmount } = serviceVotesData;

    // Validate service if provided
    if (ServiceId) {
      const serviceExists = await this.validateService(ServiceId);
      if (!serviceExists) {
        throw new AppError("Service does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate user if provided
    if (UserId) {
      const userExists = await this.validateUser(UserId);
      if (!userExists) {
        throw new AppError("User does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate quantity if provided
    if (Quantity !== undefined && Quantity <= 0) {
      throw new AppError(
        "Quantity must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Build update query dynamically
    let updateFields = [];
    let params = [];

    if (ServiceId !== undefined) {
      updateFields.push("ServiceId = ?");
      params.push(ServiceId);
    }

    if (UserId !== undefined) {
      updateFields.push("UserId = ?");
      params.push(UserId);
    }

    if (Quantity !== undefined) {
      updateFields.push("Quantity = ?");
      params.push(Quantity);
    }

    if (TotalAmount !== undefined) {
      updateFields.push("TotalAmount = ?");
      params.push(TotalAmount);
    }

    if (updateFields.length === 0) {
      throw new AppError("No fields to update", HTTP_STATUS.BAD_REQUEST);
    }

    params.push(serviceVotesId);

    const updateQuery = `
      UPDATE ServiceVotes
      SET ${updateFields.join(", ")}
      WHERE ServiceVotesId = ?
    `;

    await executeMysqlQuery(updateQuery, params);

    logger.info(`Updated service votes with ID: ${serviceVotesId}`);
    return await this.getServiceVotesById(serviceVotesId);
  }

  /**
   * Delete service votes (soft delete)
   * @param {Number} serviceVotesId - Service votes ID
   * @returns {Promise<void>}
   */
  async deleteServiceVotes(serviceVotesId) {
    // Check if service votes exists
    await this.getServiceVotesById(serviceVotesId);

    // Soft delete
    const deleteQuery = `
      UPDATE ServiceVotes
      SET Deleted = 1
      WHERE ServiceVotesId = ?
    `;

    await executeMysqlQuery(deleteQuery, [serviceVotesId]);
    logger.info(`Soft deleted service votes with ID: ${serviceVotesId}`);
  }

  /**
   * Get service votes by user
   * @param {Number} userId - User ID
   * @returns {Promise<Array>} - Service votes for user
   */
  async getServiceVotesByUser(userId) {
    const query = `
      SELECT 
        sv.*,
        s.ServiceName,
        s.Price as ServicePrice
      FROM ServiceVotes sv
      LEFT JOIN Service s ON sv.ServiceId = s.ServiceId
      WHERE sv.UserId = ? AND sv.Deleted = 0
      ORDER BY sv.ServiceVotesId DESC
    `;

    const serviceVotes = await executeMysqlQuery(query, [userId]);
    return serviceVotes;
  }

  /**
   * Get service votes statistics
   * @returns {Promise<Object>} - Service votes statistics
   */
  async getServiceVotesStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalServiceVotes,
        SUM(Quantity) as totalQuantity,
        SUM(TotalAmount) as totalRevenue,
        AVG(TotalAmount) as averageAmount
      FROM ServiceVotes
      WHERE Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  // Helper methods

  /**
   * Validate service exists
   * @param {Number} serviceId - Service ID
   * @returns {Promise<Boolean>}
   */
  async validateService(serviceId) {
    const query =
      "SELECT ServiceId FROM Service WHERE ServiceId = ? AND Deleted = 0";
    const [service] = await executeMysqlQuery(query, [serviceId]);
    return !!service;
  }

  /**
   * Validate user exists
   * @param {Number} userId - User ID
   * @returns {Promise<Boolean>}
   */
  async validateUser(userId) {
    const query = "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0";
    const [user] = await executeMysqlQuery(query, [userId]);
    return !!user;
  }

  /**
   * Get service by ID (for price calculation)
   * @param {Number} serviceId - Service ID
   * @returns {Promise<Object>}
   */
  async getServiceById(serviceId) {
    const query = "SELECT * FROM Service WHERE ServiceId = ? AND Deleted = 0";
    const [service] = await executeMysqlQuery(query, [serviceId]);
    return service;
  }
}

export default new ServiceVotesService();
