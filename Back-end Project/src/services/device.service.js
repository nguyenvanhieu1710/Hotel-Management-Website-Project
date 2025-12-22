import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Device Service
 * Handles all device-related business logic
 */
class DeviceService {
  /**
   * Get all devices with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Devices data with pagination info
   */
  async getAllDevices(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["d.Deleted = 0"];
    let queryParams = [];

    if (filters.deviceTypeId) {
      whereConditions.push("d.DeviceTypeId = ?");
      queryParams.push(filters.deviceTypeId);
    }

    if (filters.roomId) {
      whereConditions.push("d.RoomId = ?");
      queryParams.push(filters.roomId);
    }

    if (filters.status) {
      whereConditions.push("d.Status = ?");
      queryParams.push(filters.status);
    }

    if (filters.minPrice) {
      whereConditions.push("d.Price >= ?");
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      whereConditions.push("d.Price <= ?");
      queryParams.push(filters.maxPrice);
    }

    if (filters.search) {
      whereConditions.push("(d.DeviceName LIKE ? OR d.Description LIKE ?)");
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Device d WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated devices with related info
    const query = `
      SELECT 
        d.*,
        dt.DeviceTypeName,
        r.RoomName,
        r.RoomId,
        rt.RoomTypeName
      FROM Device d
      LEFT JOIN DeviceType dt ON d.DeviceTypeId = dt.DeviceTypeId
      LEFT JOIN Room r ON d.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE ${whereClause}
      ORDER BY d.DeviceName ASC
      LIMIT ? OFFSET ?
    `;

    const devices = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${devices.length} devices (page ${page})`);

    return {
      devices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get device by ID with details
   * @param {Number} deviceId - Device ID
   * @returns {Promise<Object>} - Device data
   */
  async getDeviceById(deviceId) {
    const query = `
      SELECT 
        d.*,
        dt.DeviceTypeName,
        dt.Description as DeviceTypeDescription,
        r.RoomName,
        r.RoomId,
        rt.RoomTypeName
      FROM Device d
      LEFT JOIN DeviceType dt ON d.DeviceTypeId = dt.DeviceTypeId
      LEFT JOIN Room r ON d.RoomId = r.RoomId
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE d.DeviceId = ? AND d.Deleted = 0
    `;

    const devices = await executeMysqlQuery(query, [deviceId]);

    if (devices.length === 0) {
      throw new AppError("Device not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Retrieved device: ${deviceId}`);
    return devices[0];
  }

  /**
   * Get devices by room
   * @param {Number} roomId - Room ID
   * @returns {Promise<Array>} - Devices in room
   */
  async getDevicesByRoom(roomId) {
    const query = `
      SELECT 
        d.*,
        dt.DeviceTypeName
      FROM Device d
      LEFT JOIN DeviceType dt ON d.DeviceTypeId = dt.DeviceTypeId
      WHERE d.RoomId = ? AND d.Deleted = 0
      ORDER BY d.DeviceName ASC
    `;

    const devices = await executeMysqlQuery(query, [roomId]);

    logger.info(`Found ${devices.length} devices in room: ${roomId}`);
    return devices;
  }

  /**
   * Get devices by type
   * @param {Number} deviceTypeId - Device type ID
   * @returns {Promise<Array>} - Devices of specified type
   */
  async getDevicesByType(deviceTypeId) {
    const query = `
      SELECT 
        d.*
      FROM Device d
      LEFT JOIN Room r ON d.RoomId = r.RoomId
      WHERE d.DeviceTypeId = ? AND d.Deleted = 0
      ORDER BY d.DeviceName ASC
    `;

    const devices = await executeMysqlQuery(query, [deviceTypeId]);

    logger.info(`Found ${devices.length} devices of type: ${deviceTypeId}`);
    return devices;
  }

  /**
   * Get devices by status
   * @param {String} status - Device status
   * @returns {Promise<Array>} - Devices with specified status
   */
  async getDevicesByStatus(status) {
    const query = `
      SELECT 
        d.*,
        dt.DeviceTypeName
      FROM Device d
      LEFT JOIN DeviceType dt ON d.DeviceTypeId = dt.DeviceTypeId
      LEFT JOIN Room r ON d.RoomId = r.RoomId
      WHERE d.Status = ? AND d.Deleted = 0
      ORDER BY d.DeviceName ASC
    `;

    const devices = await executeMysqlQuery(query, [status]);

    logger.info(`Found ${devices.length} devices with status: ${status}`);
    return devices;
  }

  /**
   * Create new device
   * @param {Object} deviceData - Device data
   * @returns {Promise<Object>} - Created device info
   */
  async createDevice(deviceData) {
    // Validate device type exists
    const deviceTypeExists = await this.validateDeviceType(
      deviceData.DeviceTypeId
    );
    if (!deviceTypeExists) {
      throw new AppError("Device type does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    // Validate room exists if provided
    if (deviceData.RoomId) {
      const roomExists = await this.validateRoom(deviceData.RoomId);
      if (!roomExists) {
        throw new AppError("Room does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate price
    if (deviceData.Price && deviceData.Price < 0) {
      throw new AppError("Price cannot be negative", HTTP_STATUS.BAD_REQUEST);
    }

    const device = {
      DeviceName: deviceData.DeviceName,
      DeviceTypeId: deviceData.DeviceTypeId,
      RoomId: deviceData.RoomId || null,
      DeviceImage: deviceData.DeviceImage || "default-device.jpg",
      Price: deviceData.Price || 0,
      Status: deviceData.Status || "Working",
      Description: deviceData.Description || "",
      Deleted: false,
    };

    const query = `
      INSERT INTO Device (
        DeviceName, DeviceTypeId, RoomId, DeviceImage, 
        Price, Status, Description, Deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeMysqlQuery(query, [
      device.DeviceName,
      device.DeviceTypeId,
      device.RoomId,
      device.DeviceImage,
      device.Price,
      device.Status,
      device.Description,
      device.Deleted,
    ]);

    logger.info(`Device created with ID: ${result.insertId}`);

    return {
      message: SUCCESS_MESSAGES.CREATED,
      deviceId: result.insertId,
    };
  }

  /**
   * Update device
   * @param {Number} deviceId - Device ID
   * @param {Object} deviceData - Updated device data
   * @returns {Promise<Object>} - Success message
   */
  async updateDevice(deviceId, deviceData) {
    // Check if device exists
    await this.getDeviceById(deviceId);

    // Validate device type if changed
    if (deviceData.DeviceTypeId) {
      const deviceTypeExists = await this.validateDeviceType(
        deviceData.DeviceTypeId
      );
      if (!deviceTypeExists) {
        throw new AppError(
          "Device type does not exist",
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // Validate room if changed
    if (deviceData.RoomId) {
      const roomExists = await this.validateRoom(deviceData.RoomId);
      if (!roomExists) {
        throw new AppError("Room does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    // Validate price
    if (deviceData.Price && deviceData.Price < 0) {
      throw new AppError("Price cannot be negative", HTTP_STATUS.BAD_REQUEST);
    }

    const query = `
      UPDATE Device 
      SET DeviceName = ?, 
          DeviceTypeId = ?, 
          RoomId = ?, 
          DeviceImage = ?, 
          Price = ?, 
          Status = ?, 
          Description = ?
      WHERE DeviceId = ?
    `;

    await executeMysqlQuery(query, [
      deviceData.DeviceName,
      deviceData.DeviceTypeId,
      deviceData.RoomId,
      deviceData.DeviceImage,
      deviceData.Price,
      deviceData.Status,
      deviceData.Description,
      deviceId,
    ]);

    logger.info(`Device updated: ${deviceId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Update device status
   * @param {Number} deviceId - Device ID
   * @param {String} status - New status
   * @returns {Promise<Object>} - Success message
   */
  async updateDeviceStatus(deviceId, status) {
    // Check if device exists
    await this.getDeviceById(deviceId);

    const query = "UPDATE Device SET Status = ? WHERE DeviceId = ?";
    await executeMysqlQuery(query, [status, deviceId]);

    logger.info(`Device ${deviceId} status updated to: ${status}`);

    return {
      message: "Device status updated successfully",
    };
  }

  /**
   * Assign device to room
   * @param {Number} deviceId - Device ID
   * @param {Number} roomId - Room ID
   * @returns {Promise<Object>} - Success message
   */
  async assignDeviceToRoom(deviceId, roomId) {
    // Check if device exists
    await this.getDeviceById(deviceId);

    // Validate room exists
    const roomExists = await this.validateRoom(roomId);
    if (!roomExists) {
      throw new AppError("Room does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    const query = "UPDATE Device SET RoomId = ? WHERE DeviceId = ?";
    await executeMysqlQuery(query, [roomId, deviceId]);

    logger.info(`Device ${deviceId} assigned to room: ${roomId}`);

    return {
      message: "Device assigned to room successfully",
    };
  }

  /**
   * Remove device from room
   * @param {Number} deviceId - Device ID
   * @returns {Promise<Object>} - Success message
   */
  async removeDeviceFromRoom(deviceId) {
    // Check if device exists
    await this.getDeviceById(deviceId);

    const query = "UPDATE Device SET RoomId = NULL WHERE DeviceId = ?";
    await executeMysqlQuery(query, [deviceId]);

    logger.info(`Device ${deviceId} removed from room`);

    return {
      message: "Device removed from room successfully",
    };
  }

  /**
   * Delete device (soft delete)
   * @param {Number} deviceId - Device ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteDevice(deviceId) {
    // Check if device exists
    await this.getDeviceById(deviceId);

    const query = "UPDATE Device SET Deleted = 1 WHERE DeviceId = ?";
    await executeMysqlQuery(query, [deviceId]);

    logger.info(`Device deleted: ${deviceId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
  }

  /**
   * Validate if device type exists
   * @param {Number} deviceTypeId - Device type ID
   * @returns {Promise<Boolean>}
   */
  async validateDeviceType(deviceTypeId) {
    const query =
      "SELECT DeviceTypeId FROM DeviceType WHERE DeviceTypeId = ? AND Deleted = 0";
    const result = await executeMysqlQuery(query, [deviceTypeId]);
    return result.length > 0;
  }

  /**
   * Validate if room exists
   * @param {Number} roomId - Room ID
   * @returns {Promise<Boolean>}
   */
  async validateRoom(roomId) {
    const query = "SELECT RoomId FROM Room WHERE RoomId = ? AND Deleted = 0";
    const result = await executeMysqlQuery(query, [roomId]);
    return result.length > 0;
  }

  /**
   * Get device statistics
   * @returns {Promise<Object>} - Device statistics
   */
  async getDeviceStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalDevices,
        SUM(CASE WHEN Status = 'Working' THEN 1 ELSE 0 END) as workingDevices,
        SUM(CASE WHEN Status = 'Broken' THEN 1 ELSE 0 END) as brokenDevices,
        SUM(CASE WHEN Status = 'Maintenance' THEN 1 ELSE 0 END) as maintenanceDevices,
        SUM(CASE WHEN RoomId IS NOT NULL THEN 1 ELSE 0 END) as assignedDevices,
        SUM(CASE WHEN RoomId IS NULL THEN 1 ELSE 0 END) as unassignedDevices,
        AVG(Price) as averagePrice,
        SUM(Price) as totalValue,
        COUNT(DISTINCT DeviceTypeId) as deviceTypes
      FROM Device 
      WHERE Deleted = 0
    `;

    const result = await executeMysqlQuery(query);
    return result[0];
  }

  /**
   * Search devices
   * @param {String} searchTerm - Search term
   * @param {Number} limit - Max results
   * @returns {Promise<Array>} - Matching devices
   */
  async searchDevices(searchTerm, limit = 20) {
    const query = `
      SELECT 
        d.*,
        dt.DeviceTypeName
      FROM Device d
      LEFT JOIN DeviceType dt ON d.DeviceTypeId = dt.DeviceTypeId
      LEFT JOIN Room r ON d.RoomId = r.RoomId
      WHERE (d.DeviceName LIKE ? OR d.Description LIKE ?)
      AND d.Deleted = 0
      ORDER BY d.DeviceName ASC
      LIMIT ?
    `;

    const search = `%${searchTerm}%`;
    const devices = await executeMysqlQuery(query, [search, search, limit]);

    logger.info(`Search "${searchTerm}" found ${devices.length} devices`);
    return devices;
  }
}

export default new DeviceService();
