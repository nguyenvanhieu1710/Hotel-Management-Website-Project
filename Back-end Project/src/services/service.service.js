import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Service Service
 * Handles all hotel service-related business logic
 */
class ServiceService {
  /**
   * Get all services with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Services data with pagination info
   */
  async getAllServices(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["s.Deleted = 0"];
    let queryParams = [];

    if (filters.serviceTypeId) {
      whereConditions.push("s.ServiceTypeId = ?");
      queryParams.push(filters.serviceTypeId);
    }

    if (filters.minPrice) {
      whereConditions.push("s.Price >= ?");
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      whereConditions.push("s.Price <= ?");
      queryParams.push(filters.maxPrice);
    }

    if (filters.search) {
      whereConditions.push("(s.ServiceName LIKE ? OR s.Description LIKE ?)");
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Service s WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated services with service type info
    const query = `
      SELECT 
        s.*,
        st.ServiceTypeName,
        st.Description as ServiceTypeDescription
      FROM Service s
      LEFT JOIN ServiceType st ON s.ServiceTypeId = st.ServiceTypeId
      WHERE ${whereClause}
      ORDER BY s.ServiceName ASC
      LIMIT ? OFFSET ?
    `;

    const services = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${services.length} services (page ${page})`);

    return {
      services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get service by ID with details
   * @param {Number} serviceId - Service ID
   * @returns {Promise<Object>} - Service data
   */
  async getServiceById(serviceId) {
    const query = `
      SELECT 
        s.*,
        st.ServiceTypeName,
        st.Description as ServiceTypeDescription
      FROM Service s
      LEFT JOIN ServiceType st ON s.ServiceTypeId = st.ServiceTypeId
      WHERE s.ServiceId = ? AND s.Deleted = 0
    `;

    const services = await executeMysqlQuery(query, [serviceId]);

    if (services.length === 0) {
      throw new AppError("Service not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Retrieved service: ${serviceId}`);
    return services[0];
  }

  /**
   * Get services by type
   * @param {Number} serviceTypeId - Service type ID
   * @returns {Promise<Array>} - Services of specified type
   */
  async getServicesByType(serviceTypeId) {
    const query = `
      SELECT * FROM Service 
      WHERE ServiceTypeId = ? AND Deleted = 0
      ORDER BY ServiceName ASC
    `;

    const services = await executeMysqlQuery(query, [serviceTypeId]);

    logger.info(`Found ${services.length} services for type: ${serviceTypeId}`);
    return services;
  }

  /**
   * Search services
   * @param {String} searchTerm - Search term
   * @param {Number} limit - Max results
   * @returns {Promise<Array>} - Matching services
   */
  async searchServices(searchTerm, limit = 20) {
    const query = `
      SELECT 
        s.*,
        st.ServiceTypeName
      FROM Service s
      LEFT JOIN ServiceType st ON s.ServiceTypeId = st.ServiceTypeId
      WHERE (s.ServiceName LIKE ? OR s.Description LIKE ?)
      AND s.Deleted = 0
      ORDER BY s.ServiceName ASC
      LIMIT ?
    `;

    const search = `%${searchTerm}%`;
    const services = await executeMysqlQuery(query, [search, search, limit]);

    logger.info(`Search "${searchTerm}" found ${services.length} services`);
    return services;
  }

  /**
   * Create new service
   * @param {Object} serviceData - Service data
   * @returns {Promise<Object>} - Created service info
   */
  async createService(serviceData) {
    // Validate service type exists
    const serviceTypeExists = await this.validateServiceType(
      serviceData.ServiceTypeId
    );
    if (!serviceTypeExists) {
      throw new AppError(
        "Service type does not exist",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate price
    if (serviceData.Price <= 0) {
      throw new AppError(
        "Price must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const service = {
      ServiceName: serviceData.ServiceName,
      ServiceTypeId: serviceData.ServiceTypeId,
      ServiceImage: serviceData.ServiceImage || "default-service.jpg",
      Price: serviceData.Price,
      Description: serviceData.Description || "",
      Deleted: false,
    };

    const query = `
      INSERT INTO Service (ServiceName, ServiceTypeId, ServiceImage, Price, Description, Deleted)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeMysqlQuery(query, [
      service.ServiceName,
      service.ServiceTypeId,
      service.ServiceImage,
      service.Price,
      service.Description,
      service.Deleted,
    ]);

    logger.info(`Service created with ID: ${result.insertId}`);

    return {
      message: SUCCESS_MESSAGES.CREATED,
      serviceId: result.insertId,
    };
  }

  /**
   * Update service
   * @param {Number} serviceId - Service ID
   * @param {Object} serviceData - Updated service data
   * @returns {Promise<Object>} - Success message
   */
  async updateService(serviceId, serviceData) {
    // Check if service exists
    await this.getServiceById(serviceId);

    // Validate service type if changed
    if (serviceData.ServiceTypeId) {
      const serviceTypeExists = await this.validateServiceType(
        serviceData.ServiceTypeId
      );
      if (!serviceTypeExists) {
        throw new AppError(
          "Service type does not exist",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Validate price
    if (serviceData.Price && serviceData.Price <= 0) {
      throw new AppError(
        "Price must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const query = `
      UPDATE Service 
      SET ServiceName = ?, 
          ServiceTypeId = ?, 
          ServiceImage = ?, 
          Price = ?, 
          Description = ?
      WHERE ServiceId = ?
    `;

    await executeMysqlQuery(query, [
      serviceData.ServiceName,
      serviceData.ServiceTypeId,
      serviceData.ServiceImage,
      serviceData.Price,
      serviceData.Description,
      serviceId,
    ]);

    logger.info(`Service updated: ${serviceId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Delete service (soft delete)
   * @param {Number} serviceId - Service ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteService(serviceId) {
    // Check if service exists
    await this.getServiceById(serviceId);

    // Check if service is being used in active bookings
    const isInUse = await this.checkServiceInUse(serviceId);
    if (isInUse) {
      throw new AppError(
        "Cannot delete service that is currently in use",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const query = "UPDATE Service SET Deleted = 1 WHERE ServiceId = ?";
    await executeMysqlQuery(query, [serviceId]);

    logger.info(`Service deleted: ${serviceId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
  }

  /**
   * Validate if service type exists
   * @param {Number} serviceTypeId - Service type ID
   * @returns {Promise<Boolean>}
   */
  async validateServiceType(serviceTypeId) {
    const query =
      "SELECT ServiceTypeId FROM ServiceType WHERE ServiceTypeId = ? AND Deleted = 0";
    const result = await executeMysqlQuery(query, [serviceTypeId]);
    return result.length > 0;
  }

  /**
   * Check if service is being used
   * @param {Number} serviceId - Service ID
   * @returns {Promise<Boolean>}
   */
  async checkServiceInUse(serviceId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM ServiceVotes 
      WHERE ServiceId = ? 
      AND Status IN ('Pending', 'Confirmed')
    `;
    const result = await executeMysqlQuery(query, [serviceId]);
    return result[0].count > 0;
  }

  /**
   * Get popular services
   * @param {Number} limit - Number of services to return
   * @returns {Promise<Array>} - Popular services
   */
  async getPopularServices(limit = 10) {
    const query = `
      SELECT 
        s.*,
        st.ServiceTypeName,
        COUNT(sv.ServiceVoteId) as bookingCount
      FROM Service s
      LEFT JOIN ServiceType st ON s.ServiceTypeId = st.ServiceTypeId
      LEFT JOIN ServiceVotes sv ON s.ServiceId = sv.ServiceId
      WHERE s.Deleted = 0
      GROUP BY s.ServiceId
      ORDER BY bookingCount DESC, s.ServiceName ASC
      LIMIT ?
    `;

    const services = await executeMysqlQuery(query, [limit]);
    return services;
  }

  /**
   * Get service statistics
   * @returns {Promise<Object>} - Service statistics
   */
  async getServiceStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalServices,
        AVG(Price) as averagePrice,
        MIN(Price) as minPrice,
        MAX(Price) as maxPrice,
        COUNT(DISTINCT ServiceTypeId) as serviceTypes
      FROM Service 
      WHERE Deleted = 0
    `;

    const result = await executeMysqlQuery(query);
    return result[0];
  }

  /**
   * Get services by price range
   * @param {Number} minPrice - Minimum price
   * @param {Number} maxPrice - Maximum price
   * @returns {Promise<Array>} - Services in price range
   */
  async getServicesByPriceRange(minPrice, maxPrice) {
    const query = `
      SELECT 
        s.*,
        st.ServiceTypeName
      FROM Service s
      LEFT JOIN ServiceType st ON s.ServiceTypeId = st.ServiceTypeId
      WHERE s.Price BETWEEN ? AND ?
      AND s.Deleted = 0
      ORDER BY s.Price ASC
    `;

    const services = await executeMysqlQuery(query, [minPrice, maxPrice]);
    return services;
  }
}

export default new ServiceService();
