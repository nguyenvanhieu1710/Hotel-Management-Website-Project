import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROOM_STATUS,
} from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Room Service
 * Handles all room-related business logic
 */
class RoomService {
  /**
   * Get all rooms with pagination and optional filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters (status, roomTypeId, etc.)
   * @returns {Promise<Object>} - Rooms data with pagination info
   */
  async getAllRooms(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause based on filters
    let whereConditions = ["Deleted = 0"];
    let queryParams = [];

    if (filters.status) {
      whereConditions.push("Status = ?");
      queryParams.push(filters.status);
    }

    if (filters.roomTypeId) {
      whereConditions.push("RoomTypeId = ?");
      queryParams.push(filters.roomTypeId);
    }

    if (filters.minPrice) {
      whereConditions.push("Price >= ?");
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      whereConditions.push("Price <= ?");
      queryParams.push(filters.maxPrice);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Room WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated rooms
    const query = `SELECT * FROM Room WHERE ${whereClause} LIMIT ? OFFSET ?`;
    const rooms = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${rooms.length} rooms (page ${page})`);

    return {
      rooms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get room by ID with related data
   * @param {Number} roomId - Room ID
   * @returns {Promise<Object>} - Room data with room type info
   */
  async getRoomById(roomId) {
    const query = `
      SELECT 
        r.*,
        rt.RoomTypeName,
        rt.Description as RoomTypeDescription
      FROM Room r
      LEFT JOIN RoomType rt ON r.RoomTypeId = rt.RoomTypeId
      WHERE r.RoomId = ? AND r.Deleted = 0
    `;

    const rooms = await executeMysqlQuery(query, [roomId]);

    if (rooms.length === 0) {
      throw new AppError("Room not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Retrieved room: ${roomId}`);
    return rooms[0];
  }

  /**
   * Get available rooms by criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} - Available rooms
   */
  async getAvailableRooms(criteria = {}) {
    let whereConditions = ["Deleted = 0", "Status = ?"];
    let queryParams = [ROOM_STATUS.AVAILABLE];

    if (criteria.roomTypeId) {
      whereConditions.push("RoomTypeId = ?");
      queryParams.push(criteria.roomTypeId);
    }

    if (criteria.minGuests) {
      whereConditions.push("MaximumNumberOfGuests >= ?");
      queryParams.push(criteria.minGuests);
    }

    if (criteria.maxPrice) {
      whereConditions.push("Price <= ?");
      queryParams.push(criteria.maxPrice);
    }

    const whereClause = whereConditions.join(" AND ");
    const query = `SELECT * FROM Room WHERE ${whereClause} ORDER BY Price ASC`;

    const rooms = await executeMysqlQuery(query, queryParams);

    logger.info(`Found ${rooms.length} available rooms`);
    return rooms;
  }

  /**
   * Create new room
   * @param {Object} roomData - Room data
   * @returns {Promise<Object>} - Created room info
   */
  async createRoom(roomData) {
    // Validate room type exists
    const roomTypeExists = await this.validateRoomType(roomData.RoomTypeId);
    if (!roomTypeExists) {
      throw new AppError("Room type does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    // Set default values
    const room = {
      RoomTypeId: roomData.RoomTypeId,
      RoomImage: roomData.RoomImage || "default-room.jpg",
      Price: roomData.Price,
      NumberOfFloor: roomData.NumberOfFloor,
      MaximumNumberOfGuests: roomData.MaximumNumberOfGuests,
      Status: roomData.Status || ROOM_STATUS.AVAILABLE,
      Description: roomData.Description || "",
      RoomArea: roomData.RoomArea,
      Amenities: roomData.Amenities || "",
      RoomDetail: roomData.RoomDetail || "",
      Deleted: false,
    };

    const query = `
      INSERT INTO Room (
        RoomTypeId, RoomImage, Price, NumberOfFloor, 
        MaximumNumberOfGuests, Status, Description, 
        RoomArea, Amenities, RoomDetail, Deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await executeMysqlQuery(query, [
      room.RoomTypeId,
      room.RoomImage,
      room.Price,
      room.NumberOfFloor,
      room.MaximumNumberOfGuests,
      room.Status,
      room.Description,
      room.RoomArea,
      room.Amenities,
      room.RoomDetail,
      room.Deleted,
    ]);

    logger.info(`Room created with ID: ${result.insertId}`);

    return {
      message: SUCCESS_MESSAGES.CREATED,
      roomId: result.insertId,
    };
  }

  /**
   * Update room
   * @param {Number} roomId - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise<Object>} - Success message
   */
  async updateRoom(roomId, roomData) {
    // Check if room exists
    await this.getRoomById(roomId);

    // Validate room type if changed
    if (roomData.RoomTypeId) {
      const roomTypeExists = await this.validateRoomType(roomData.RoomTypeId);
      if (!roomTypeExists) {
        throw new AppError("Room type does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    const query = `
      UPDATE Room 
      SET RoomTypeId = ?, 
          RoomImage = ?, 
          Price = ?, 
          NumberOfFloor = ?, 
          MaximumNumberOfGuests = ?, 
          Status = ?, 
          Description = ?, 
          RoomArea = ?, 
          Amenities = ?, 
          RoomDetail = ?
      WHERE RoomId = ?
    `;

    await executeMysqlQuery(query, [
      roomData.RoomTypeId,
      roomData.RoomImage,
      roomData.Price,
      roomData.NumberOfFloor,
      roomData.MaximumNumberOfGuests,
      roomData.Status,
      roomData.Description,
      roomData.RoomArea,
      roomData.Amenities,
      roomData.RoomDetail,
      roomId,
    ]);

    logger.info(`Room updated: ${roomId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Update room status
   * @param {Number} roomId - Room ID
   * @param {String} status - New status
   * @returns {Promise<Object>} - Success message
   */
  async updateRoomStatus(roomId, status) {
    // Validate status
    const validStatuses = Object.values(ROOM_STATUS);
    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid room status", HTTP_STATUS.BAD_REQUEST);
    }

    // Check if room exists
    await this.getRoomById(roomId);

    const query = "UPDATE Room SET Status = ? WHERE RoomId = ?";
    await executeMysqlQuery(query, [status, roomId]);

    logger.info(`Room ${roomId} status updated to: ${status}`);

    return {
      message: "Room status updated successfully",
    };
  }

  /**
   * Delete room (soft delete)
   * @param {Number} roomId - Room ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteRoom(roomId) {
    // Check if room exists
    await this.getRoomById(roomId);

    // Check if room has active bookings
    const hasActiveBookings = await this.checkActiveBookings(roomId);
    if (hasActiveBookings) {
      throw new AppError(
        "Cannot delete room with active bookings",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const query = "UPDATE Room SET Deleted = 1 WHERE RoomId = ?";
    await executeMysqlQuery(query, [roomId]);

    logger.info(`Room deleted: ${roomId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
  }

  /**
   * Validate if room type exists
   * @param {Number} roomTypeId - Room type ID
   * @returns {Promise<Boolean>}
   */
  async validateRoomType(roomTypeId) {
    const query =
      "SELECT RoomTypeId FROM RoomType WHERE RoomTypeId = ? AND Deleted = 0";
    const result = await executeMysqlQuery(query, [roomTypeId]);
    return result.length > 0;
  }

  /**
   * Check if room has active bookings
   * @param {Number} roomId - Room ID
   * @returns {Promise<Boolean>}
   */
  async checkActiveBookings(roomId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM BookingVotesDetail 
      WHERE RoomId = ? 
      AND Status IN ('Pending', 'Confirmed', 'CheckedIn')
    `;
    const result = await executeMysqlQuery(query, [roomId]);
    return result[0].count > 0;
  }

  /**
   * Get room statistics
   * @returns {Promise<Object>} - Room statistics
   */
  async getRoomStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalRooms,
        SUM(CASE WHEN Status = 'Available' THEN 1 ELSE 0 END) as availableRooms,
        SUM(CASE WHEN Status = 'Occupied' THEN 1 ELSE 0 END) as occupiedRooms,
        SUM(CASE WHEN Status = 'Maintenance' THEN 1 ELSE 0 END) as maintenanceRooms,
        AVG(Price) as averagePrice,
        MIN(Price) as minPrice,
        MAX(Price) as maxPrice
      FROM Room 
      WHERE Deleted = 0
    `;

    const result = await executeMysqlQuery(query);
    return result[0];
  }
}

export default new RoomService();
