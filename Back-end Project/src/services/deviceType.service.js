import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Device Type Service
 * Handles all device type-related business logic
 */
class DeviceTypeService {
  /**
   * Get all device types with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Device types data with pagination info
   */
  async getAllDeviceTypes(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["Deleted = 0"];
    let queryParams = [];

    if (filters.search) {
      whereConditions.push("(DeviceTypeName LIKE ? OR Description LIKE ?)");
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM DeviceType WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated data
    const query = `
      SELECT DeviceTypeId, DeviceTypeName, Description, Deleted
      FROM DeviceType
      WHERE ${whereClause}
      ORDER BY DeviceTypeName ASC
      LIMIT ? OFFSET ?
    `;

    const deviceTypes = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${deviceTypes.length} device types (page ${page})`);

    return {
      deviceTypes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get device type by ID
   * @param {Number} deviceTypeId - Device type ID
   * @returns {Promise<Object>} - Device type data
   */
  async getDeviceTypeById(deviceTypeId) {
    const query = `
      SELECT DeviceTypeId, DeviceTypeName, Description, Deleted
      FROM DeviceType
      WHERE DeviceTypeId = ? AND Deleted = 0
    `;
    const [deviceType] = await executeMysqlQuery(query, [deviceTypeId]);

    if (!deviceType) {
      throw new AppError(
        ERROR_MESSAGES.NOT_FOUND("Device type"),
        HTTP_STATUS.NOT_FOUND
      );
    }

    return deviceType;
  }

  /**
   * Create new device type
   * @param {Object} deviceTypeData - Device type data
   * @returns {Promise<Object>} - Created device type
   */
  async createDeviceType(deviceTypeData) {
    const { DeviceTypeName, Description } = deviceTypeData;

    // Check if device type name already exists
    const existingQuery = `
      SELECT DeviceTypeId FROM DeviceType 
      WHERE DeviceTypeName = ? AND Deleted = 0
    `;
    const [existing] = await executeMysqlQuery(existingQuery, [DeviceTypeName]);

    if (existing) {
      throw new AppError(
        "Device type name already exists",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Create device type
    const insertQuery = `
      INSERT INTO DeviceType (DeviceTypeName, Description, Deleted)
      VALUES (?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      DeviceTypeName,
      Description,
    ]);

    logger.info(
      `Created device type: ${DeviceTypeName} (ID: ${result.insertId})`
    );

    return {
      DeviceTypeId: result.insertId,
      DeviceTypeName,
      Description,
      Deleted: false,
    };
  }

  /**
   * Update device type
   * @param {Number} deviceTypeId - Device type ID
   * @param {Object} deviceTypeData - Updated device type data
   * @returns {Promise<Object>} - Updated device type
   */
  async updateDeviceType(deviceTypeId, deviceTypeData) {
    // Check if device type exists
    await this.getDeviceTypeById(deviceTypeId);

    const { DeviceTypeName, Description } = deviceTypeData;

    // Check if new name conflicts with existing device type
    if (DeviceTypeName) {
      const existingQuery = `
        SELECT DeviceTypeId FROM DeviceType 
        WHERE DeviceTypeName = ? AND DeviceTypeId != ? AND Deleted = 0
      `;
      const [existing] = await executeMysqlQuery(existingQuery, [
        DeviceTypeName,
        deviceTypeId,
      ]);

      if (existing) {
        throw new AppError(
          "Device type name already exists",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Build update query dynamically
    let updateFields = [];
    let params = [];

    if (DeviceTypeName) {
      updateFields.push("DeviceTypeName = ?");
      params.push(DeviceTypeName);
    }

    if (Description) {
      updateFields.push("Description = ?");
      params.push(Description);
    }

    if (updateFields.length === 0) {
      throw new AppError("No fields to update", HTTP_STATUS.BAD_REQUEST);
    }

    params.push(deviceTypeId);

    const updateQuery = `
      UPDATE DeviceType
      SET ${updateFields.join(", ")}
      WHERE DeviceTypeId = ?
    `;

    await executeMysqlQuery(updateQuery, params);

    logger.info(`Updated device type with ID: ${deviceTypeId}`);
    return await this.getDeviceTypeById(deviceTypeId);
  }

  /**
   * Delete device type (soft delete)
   * @param {Number} deviceTypeId - Device type ID
   * @returns {Promise<void>}
   */
  async deleteDeviceType(deviceTypeId) {
    // Check if device type exists
    await this.getDeviceTypeById(deviceTypeId);

    // Check if device type is being used by any devices
    const usageQuery = `
      SELECT COUNT(*) as count FROM Device 
      WHERE DeviceTypeId = ? AND Deleted = 0
    `;
    const [usage] = await executeMysqlQuery(usageQuery, [deviceTypeId]);

    if (usage.count > 0) {
      throw new AppError(
        `Cannot delete device type. It is being used by ${usage.count} device(s)`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Soft delete
    const deleteQuery = `
      UPDATE DeviceType
      SET Deleted = 1
      WHERE DeviceTypeId = ?
    `;

    await executeMysqlQuery(deleteQuery, [deviceTypeId]);
    logger.info(`Soft deleted device type with ID: ${deviceTypeId}`);
  }

  /**
   * Get device type statistics
   * @returns {Promise<Object>} - Device type statistics
   */
  async getDeviceTypeStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalDeviceTypes,
        (SELECT COUNT(*) FROM Device d WHERE d.DeviceTypeId = dt.DeviceTypeId AND d.Deleted = 0) as totalDevices
      FROM DeviceType dt
      WHERE dt.Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  /**
   * Get all device types for dropdown (no pagination)
   * @returns {Promise<Array>} - All device types
   */
  async getAllDeviceTypesForDropdown() {
    const query = `
      SELECT DeviceTypeId, DeviceTypeName, Description
      FROM DeviceType
      WHERE Deleted = 0
      ORDER BY DeviceTypeName ASC
    `;

    const deviceTypes = await executeMysqlQuery(query);
    return deviceTypes;
  }
}

export default new DeviceTypeService();
