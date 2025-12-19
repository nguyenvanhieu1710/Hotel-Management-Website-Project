import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Service Type Service
 * Handles all service type-related business logic
 */
class ServiceTypeService {
  /**
   * Get all service types with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Service types data with pagination info
   */
  async getAllServiceTypes(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["Deleted = 0"];
    let queryParams = [];

    if (filters.search) {
      whereConditions.push("(ServiceTypeName LIKE ? OR Description LIKE ?)");
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ServiceType WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const query = `
      SELECT ServiceTypeId, ServiceTypeName, Description, Deleted
      FROM ServiceType
      WHERE ${whereClause}
      ORDER BY ServiceTypeName ASC
      LIMIT ? OFFSET ?
    `;

    const serviceTypes = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(
      `Retrieved ${serviceTypes.length} service types (page ${page})`
    );

    return {
      serviceTypes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get service type by ID
   * @param {Number} serviceTypeId - Service type ID
   * @returns {Promise<Object>} - Service type data
   */
  async getServiceTypeById(serviceTypeId) {
    const query = `
      SELECT ServiceTypeId, ServiceTypeName, Description, Deleted
      FROM ServiceType
      WHERE ServiceTypeId = ? AND Deleted = 0
    `;
    const [serviceType] = await executeMysqlQuery(query, [serviceTypeId]);

    if (!serviceType) {
      throw new AppError(
        ERROR_MESSAGES.NOT_FOUND("Service type"),
        HTTP_STATUS.NOT_FOUND
      );
    }

    return serviceType;
  }

  /**
   * Create new service type
   * @param {Object} serviceTypeData - Service type data
   * @returns {Promise<Object>} - Created service type
   */
  async createServiceType(serviceTypeData) {
    const { ServiceTypeName, Description } = serviceTypeData;

    // Check if service type name already exists
    const existingQuery = `
      SELECT ServiceTypeId FROM ServiceType 
      WHERE ServiceTypeName = ? AND Deleted = 0
    `;
    const [existing] = await executeMysqlQuery(existingQuery, [
      ServiceTypeName,
    ]);

    if (existing) {
      throw new AppError(
        "Service type name already exists",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Create service type
    const insertQuery = `
      INSERT INTO ServiceType (ServiceTypeName, Description, Deleted)
      VALUES (?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      ServiceTypeName,
      Description,
    ]);

    logger.info(
      `Created service type: ${ServiceTypeName} (ID: ${result.insertId})`
    );

    return {
      ServiceTypeId: result.insertId,
      ServiceTypeName,
      Description,
      Deleted: false,
    };
  }

  /**
   * Update service type
   * @param {Number} serviceTypeId - Service type ID
   * @param {Object} serviceTypeData - Updated service type data
   * @returns {Promise<Object>} - Updated service type
   */
  async updateServiceType(serviceTypeId, serviceTypeData) {
    // Check if service type exists
    await this.getServiceTypeById(serviceTypeId);

    const { ServiceTypeName, Description } = serviceTypeData;

    // Check if new name conflicts with existing service type
    if (ServiceTypeName) {
      const existingQuery = `
        SELECT ServiceTypeId FROM ServiceType 
        WHERE ServiceTypeName = ? AND ServiceTypeId != ? AND Deleted = 0
      `;
      const [existing] = await executeMysqlQuery(existingQuery, [
        ServiceTypeName,
        serviceTypeId,
      ]);

      if (existing) {
        throw new AppError(
          "Service type name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Build update query dynamically
    let updateFields = [];
    let params = [];

    if (ServiceTypeName) {
      updateFields.push("ServiceTypeName = ?");
      params.push(ServiceTypeName);
    }

    if (Description) {
      updateFields.push("Description = ?");
      params.push(Description);
    }

    if (updateFields.length === 0) {
      throw new AppError("No fields to update", HTTP_STATUS.BAD_REQUEST);
    }

    params.push(serviceTypeId);

    const updateQuery = `
      UPDATE ServiceType
      SET ${updateFields.join(", ")}
      WHERE ServiceTypeId = ?
    `;

    await executeMysqlQuery(updateQuery, params);

    logger.info(`Updated service type with ID: ${serviceTypeId}`);
    return await this.getServiceTypeById(serviceTypeId);
  }

  /**
   * Delete service type (soft delete)
   * @param {Number} serviceTypeId - Service type ID
   * @returns {Promise<void>}
   */
  async deleteServiceType(serviceTypeId) {
    // Check if service type exists
    await this.getServiceTypeById(serviceTypeId);

    // Check if service type is being used by any services
    const usageQuery = `
      SELECT COUNT(*) as count FROM Service 
      WHERE ServiceTypeId = ? AND Deleted = 0
    `;
    const [usage] = await executeMysqlQuery(usageQuery, [serviceTypeId]);

    if (usage.count > 0) {
      throw new AppError(
        `Cannot delete service type. It is being used by ${usage.count} service(s)`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Soft delete
    const deleteQuery = `
      UPDATE ServiceType
      SET Deleted = 1
      WHERE ServiceTypeId = ?
    `;

    await executeMysqlQuery(deleteQuery, [serviceTypeId]);
    logger.info(`Soft deleted service type with ID: ${serviceTypeId}`);
  }

  /**
   * Get service type statistics
   * @returns {Promise<Object>} - Service type statistics
   */
  async getServiceTypeStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalServiceTypes,
        (SELECT COUNT(*) FROM Service s WHERE s.ServiceTypeId = st.ServiceTypeId AND s.Deleted = 0) as totalServices
      FROM ServiceType st
      WHERE st.Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  /**
   * Get all service types for dropdown (no pagination)
   * @returns {Promise<Array>} - All service types
   */
  async getAllServiceTypesForDropdown() {
    const query = `
      SELECT ServiceTypeId, ServiceTypeName, Description
      FROM ServiceType
      WHERE Deleted = 0
      ORDER BY ServiceTypeName ASC
    `;

    const serviceTypes = await executeMysqlQuery(query);
    return serviceTypes;
  }
}

export default new ServiceTypeService();
