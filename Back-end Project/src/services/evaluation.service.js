import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Evaluation Service
 * Handles all business logic for room evaluations/reviews
 */
class EvaluationService {
  /**
   * Get all evaluations with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {number} options.roomId - Filter by room ID
   * @param {number} options.userId - Filter by user ID
   * @param {number} options.minRating - Minimum rating filter
   * @param {string} options.status - Filter by status
   * @returns {Promise<Object>} Paginated evaluations with metadata
   */
  async getAllEvaluations(options = {}) {
    const { page = 1, limit = 10, roomId, userId, minRating, status } = options;

    const offset = (page - 1) * limit;
    let whereConditions = ["e.Deleted = 0"];
    let params = [];

    // Build WHERE conditions
    if (roomId) {
      whereConditions.push("e.RoomId = ?");
      params.push(roomId);
    }

    if (userId) {
      whereConditions.push("e.UserId = ?");
      params.push(userId);
    }

    if (minRating) {
      whereConditions.push("e.Rating >= ?");
      params.push(minRating);
    }

    if (status) {
      whereConditions.push("e.Status = ?");
      params.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Evaluation e
      WHERE ${whereClause}
    `;
    const [countResult] = await executeMysqlQuery(countQuery, params);
    const total = countResult.total;

    // Get paginated data with user and room info
    const dataQuery = `
      SELECT 
        e.*,
        u.UserName,
        u.PhoneNumber as UserPhone,
        rt.RoomTypeName
      FROM Evaluation e
      LEFT JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN Room r ON e.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE ${whereClause}
      ORDER BY e.EvaluationId DESC
      LIMIT ? OFFSET ?
    `;
    const evaluations = await executeMysqlQuery(dataQuery, [
      ...params,
      limit,
      offset,
    ]);

    return {
      data: evaluations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get evaluation by ID
   * @param {number} evaluationId - Evaluation ID
   * @returns {Promise<Object>} Evaluation details
   */
  async getEvaluationById(evaluationId) {
    const query = `
      SELECT 
        e.*,
        u.UserName,
        u.PhoneNumber as UserPhone,
        rt.RoomTypeName
      FROM Evaluation e
      LEFT JOIN Users u ON e.UserId = u.UserId
      LEFT JOIN Room r ON e.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE e.EvaluationId = ? AND e.Deleted = 0
    `;
    const [evaluation] = await executeMysqlQuery(query, [evaluationId]);

    if (!evaluation) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Evaluation"), 404);
    }

    return evaluation;
  }

  /**
   * Get evaluations by room ID
   * @param {number} roomId - Room ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Room evaluations
   */
  async getEvaluationsByRoomId(roomId, options = {}) {
    const { limit = 10, minRating, status = "Approved" } = options;

    let whereConditions = ["RoomId = ?", "Deleted = 0"];
    let params = [roomId];

    if (minRating) {
      whereConditions.push("Rating >= ?");
      params.push(minRating);
    }

    if (status) {
      whereConditions.push("Status = ?");
      params.push(status);
    }

    const whereClause = whereConditions.join(" AND ");

    const query = `
      SELECT 
        e.*,
        u.UserName,
        u.PhoneNumber as UserPhone
      FROM Evaluation e
      LEFT JOIN Users u ON e.UserId = u.UserId
      WHERE ${whereClause}
      ORDER BY e.EvaluationId DESC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [...params, limit]);
  }

  /**
   * Get evaluations by user ID
   * @param {number} userId - User ID
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} User evaluations
   */
  async getEvaluationsByUserId(userId, limit = 10) {
    const query = `
      SELECT 
        e.*,
        rt.RoomTypeName
      FROM Evaluation e
      LEFT JOIN Room r ON e.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE e.UserId = ? AND e.Deleted = 0
      ORDER BY e.EvaluationId DESC
      LIMIT ?
    `;

    return await executeMysqlQuery(query, [userId, limit]);
  }

  /**
   * Create new evaluation
   * @param {Object} evaluationData - Evaluation data
   * @returns {Promise<Object>} Created evaluation
   */
  async createEvaluation(evaluationData) {
    const {
      UserId,
      RoomId,
      Rating,
      Comment,
      Status = "Pending",
    } = evaluationData;

    // Validate user exists
    await this.validateUserExists(UserId);

    // Validate room exists
    await this.validateRoomExists(RoomId);

    // Validate rating
    if (!Rating || Rating < 1 || Rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    // Check if user has already evaluated this room
    const existingQuery = `
      SELECT EvaluationId 
      FROM Evaluation 
      WHERE UserId = ? AND RoomId = ? AND Deleted = 0
    `;
    const [existing] = await executeMysqlQuery(existingQuery, [UserId, RoomId]);

    if (existing) {
      throw new AppError(
        "You have already submitted an evaluation for this room",
        400
      );
    }

    // Insert evaluation
    const insertQuery = `
      INSERT INTO Evaluation 
      (UserId, RoomId, Rating, Comment, Status, Deleted)
      VALUES (?, ?, ?, ?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      UserId,
      RoomId,
      Rating,
      Comment,
      Status,
    ]);

    logger.info(`Evaluation created with ID: ${result.insertId}`);
    return await this.getEvaluationById(result.insertId);
  }

  /**
   * Update evaluation
   * @param {number} evaluationId - Evaluation ID
   * @param {Object} evaluationData - Updated evaluation data
   * @returns {Promise<Object>} Updated evaluation
   */
  async updateEvaluation(evaluationId, evaluationData) {
    // Check if evaluation exists
    const existingEvaluation = await this.getEvaluationById(evaluationId);

    const { UserId, RoomId, Rating, Comment, Status, Deleted } = evaluationData;

    // Validate rating if provided
    if (Rating && (Rating < 1 || Rating > 5)) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    // Validate user exists if provided
    if (UserId) {
      await this.validateUserExists(UserId);
    }

    // Validate room exists if provided
    if (RoomId) {
      await this.validateRoomExists(RoomId);
    }

    // Update evaluation
    const updateQuery = `
      UPDATE Evaluation
      SET UserId = ?, RoomId = ?, Rating = ?, Comment = ?, Status = ?, Deleted = ?
      WHERE EvaluationId = ?
    `;
    await executeMysqlQuery(updateQuery, [
      UserId || existingEvaluation.UserId,
      RoomId || existingEvaluation.RoomId,
      Rating || existingEvaluation.Rating,
      Comment !== undefined ? Comment : existingEvaluation.Comment,
      Status || existingEvaluation.Status,
      Deleted !== undefined ? Deleted : existingEvaluation.Deleted,
      evaluationId,
    ]);

    logger.info(`Evaluation updated: ${evaluationId}`);
    return await this.getEvaluationById(evaluationId);
  }

  /**
   * Update evaluation status
   * @param {number} evaluationId - Evaluation ID
   * @param {string} status - New status (Pending, Approved, Rejected)
   * @returns {Promise<Object>} Updated evaluation
   */
  async updateEvaluationStatus(evaluationId, status) {
    // Validate status
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const query = `
      UPDATE Evaluation
      SET Status = ?
      WHERE EvaluationId = ? AND Deleted = 0
    `;

    const result = await executeMysqlQuery(query, [status, evaluationId]);

    if (result.affectedRows === 0) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Evaluation"), 404);
    }

    logger.info(`Evaluation ${evaluationId} status updated to: ${status}`);
    return await this.getEvaluationById(evaluationId);
  }

  /**
   * Delete evaluation (soft delete)
   * @param {number} evaluationId - Evaluation ID
   * @returns {Promise<void>}
   */
  async deleteEvaluation(evaluationId) {
    // Check if evaluation exists
    await this.getEvaluationById(evaluationId);

    const query = `
      UPDATE Evaluation
      SET Deleted = 1
      WHERE EvaluationId = ?
    `;

    await executeMysqlQuery(query, [evaluationId]);
    logger.info(`Evaluation soft deleted: ${evaluationId}`);
  }

  /**
   * Get room rating statistics
   * @param {number} roomId - Room ID
   * @returns {Promise<Object>} Rating statistics
   */
  async getRoomRatingStats(roomId) {
    const query = `
      SELECT 
        COUNT(*) as totalReviews,
        AVG(Rating) as averageRating,
        SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) as fiveStars,
        SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) as fourStars,
        SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) as threeStars,
        SUM(CASE WHEN Rating = 2 THEN 1 ELSE 0 END) as twoStars,
        SUM(CASE WHEN Rating = 1 THEN 1 ELSE 0 END) as oneStar
      FROM Evaluation
      WHERE RoomId = ? AND Deleted = 0 AND Status = 'Approved'
    `;

    const [stats] = await executeMysqlQuery(query, [roomId]);
    return stats;
  }

  /**
   * Get evaluation statistics
   * @returns {Promise<Object>} Evaluation statistics
   */
  async getEvaluationStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalEvaluations,
        SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) as pendingEvaluations,
        SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) as approvedEvaluations,
        SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) as rejectedEvaluations,
        AVG(Rating) as averageRating
      FROM Evaluation
      WHERE Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  // ==================== Validation Methods ====================

  /**
   * Validate user exists
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  async validateUserExists(userId) {
    const query = "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0";
    const [user] = await executeMysqlQuery(query, [userId]);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("User"), 404);
    }
  }

  /**
   * Validate room exists
   * @param {number} roomId - Room ID
   * @returns {Promise<void>}
   */
  async validateRoomExists(roomId) {
    const query = "SELECT RoomId FROM Room WHERE RoomId = ? AND Deleted = 0";
    const [room] = await executeMysqlQuery(query, [roomId]);

    if (!room) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Room"), 404);
    }
  }
}

export default new EvaluationService();
