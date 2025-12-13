import bcryptjs from "bcryptjs";
import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  USER_ROLES,
  ACCOUNT_STATUS,
} from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Staff Service
 * Handles all staff-related business logic
 */
class StaffService {
  /**
   * Get all staff with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Staff data with pagination info
   */
  async getAllStaff(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["s.Deleted = 0"];
    let queryParams = [];

    if (filters.position) {
      whereConditions.push("s.Position = ?");
      queryParams.push(filters.position);
    }

    if (filters.status) {
      whereConditions.push("s.Status = ?");
      queryParams.push(filters.status);
    }

    if (filters.minSalary) {
      whereConditions.push("s.Salary >= ?");
      queryParams.push(filters.minSalary);
    }

    if (filters.maxSalary) {
      whereConditions.push("s.Salary <= ?");
      queryParams.push(filters.maxSalary);
    }

    if (filters.search) {
      whereConditions.push("(s.StaffName LIKE ? OR s.PhoneNumber LIKE ?)");
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Staff s WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated staff with account info
    const query = `
      SELECT 
        s.*,
        a.Email,
        a.Status as AccountStatus
      FROM Staff s
      LEFT JOIN Account a ON s.StaffId = a.AccountId
      WHERE ${whereClause}
      ORDER BY s.StaffName ASC
      LIMIT ? OFFSET ?
    `;

    const staff = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${staff.length} staff members (page ${page})`);

    return {
      staff,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get staff by ID with details
   * @param {Number} staffId - Staff ID
   * @returns {Promise<Object>} - Staff data
   */
  async getStaffById(staffId) {
    const query = `
      SELECT 
        s.*,
        a.Email,
        a.Status as AccountStatus,
        a.CreationDate as AccountCreationDate
      FROM Staff s
      LEFT JOIN Account a ON s.StaffId = a.AccountId
      WHERE s.StaffId = ? AND s.Deleted = 0
    `;

    const staff = await executeMysqlQuery(query, [staffId]);

    if (staff.length === 0) {
      throw new AppError("Staff not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Retrieved staff: ${staffId}`);
    return staff[0];
  }

  /**
   * Get staff by position
   * @param {String} position - Position name
   * @returns {Promise<Array>} - Staff members in position
   */
  async getStaffByPosition(position) {
    const query = `
      SELECT s.*, a.Email
      FROM Staff s
      LEFT JOIN Account a ON s.StaffId = a.AccountId
      WHERE s.Position = ? AND s.Deleted = 0
      ORDER BY s.StaffName ASC
    `;

    const staff = await executeMysqlQuery(query, [position]);

    logger.info(`Found ${staff.length} staff members in position: ${position}`);
    return staff;
  }

  /**
   * Create new staff member
   * @param {Object} staffData - Staff data
   * @returns {Promise<Object>} - Created staff info
   */
  async createStaff(staffData) {
    const connection = await this.getConnection();

    try {
      await connection.beginTransaction();

      // Validate salary
      if (staffData.Salary <= 0) {
        throw new AppError(
          "Salary must be greater than 0",
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Hash default password
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash("123456", salt);

      // Create account
      const email = `${staffData.StaffName.toLowerCase().replace(
        /\s+/g,
        ""
      )}@hotel.com`;
      const creationDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const accountResult = await executeMysqlQuery(
        `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          staffData.StaffName,
          hashedPassword,
          USER_ROLES.STAFF,
          email,
          ACCOUNT_STATUS.OFFLINE,
          creationDate,
          false,
        ]
      );

      const accountId = accountResult.insertId;

      // Format dates
      const dateOfBirth =
        staffData.DateOfBirth ||
        new Date("1990-01-01").toISOString().slice(0, 19).replace("T", " ");
      const workStartDate =
        staffData.WorkStartDate ||
        new Date().toISOString().slice(0, 19).replace("T", " ");

      // Create staff
      await executeMysqlQuery(
        `INSERT INTO Staff (
          StaffId, StaffName, StaffImage, DateOfBirth, Gender, 
          PhoneNumber, Address, Position, Salary, Status, 
          WorkStartDate, Description, Deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accountId,
          staffData.StaffName,
          staffData.StaffImage || "default-staff.jpg",
          dateOfBirth,
          staffData.Gender,
          staffData.PhoneNumber,
          staffData.Address,
          staffData.Position,
          staffData.Salary,
          staffData.Status || "Active",
          workStartDate,
          staffData.Description || "",
          false,
        ]
      );

      await connection.commit();

      logger.info(`Staff created: ${staffData.StaffName} (ID: ${accountId})`);

      return {
        message: SUCCESS_MESSAGES.CREATED,
        staffId: accountId,
        email,
      };
    } catch (error) {
      await connection.rollback();
      logger.error(`Create staff error: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update staff
   * @param {Number} staffId - Staff ID
   * @param {Object} staffData - Updated staff data
   * @returns {Promise<Object>} - Success message
   */
  async updateStaff(staffId, staffData) {
    // Check if staff exists
    await this.getStaffById(staffId);

    // Validate salary if provided
    if (staffData.Salary && staffData.Salary <= 0) {
      throw new AppError(
        "Salary must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Format dates
    const dateOfBirth = staffData.DateOfBirth
      ? new Date(staffData.DateOfBirth)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
      : undefined;
    const workStartDate = staffData.WorkStartDate
      ? new Date(staffData.WorkStartDate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
      : undefined;

    const query = `
      UPDATE Staff 
      SET StaffName = ?, 
          StaffImage = ?, 
          DateOfBirth = ?, 
          Gender = ?, 
          PhoneNumber = ?, 
          Address = ?, 
          Position = ?, 
          Salary = ?, 
          Status = ?, 
          WorkStartDate = ?, 
          Description = ?
      WHERE StaffId = ?
    `;

    await executeMysqlQuery(query, [
      staffData.StaffName,
      staffData.StaffImage,
      dateOfBirth,
      staffData.Gender,
      staffData.PhoneNumber,
      staffData.Address,
      staffData.Position,
      staffData.Salary,
      staffData.Status,
      workStartDate,
      staffData.Description,
      staffId,
    ]);

    logger.info(`Staff updated: ${staffId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Update staff status
   * @param {Number} staffId - Staff ID
   * @param {String} status - New status
   * @returns {Promise<Object>} - Success message
   */
  async updateStaffStatus(staffId, status) {
    // Check if staff exists
    await this.getStaffById(staffId);

    const query = "UPDATE Staff SET Status = ? WHERE StaffId = ?";
    await executeMysqlQuery(query, [status, staffId]);

    logger.info(`Staff ${staffId} status updated to: ${status}`);

    return {
      message: "Staff status updated successfully",
    };
  }

  /**
   * Delete staff (soft delete)
   * @param {Number} staffId - Staff ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteStaff(staffId) {
    // Check if staff exists
    await this.getStaffById(staffId);

    // Soft delete staff
    await executeMysqlQuery("UPDATE Staff SET Deleted = 1 WHERE StaffId = ?", [
      staffId,
    ]);

    // Also soft delete the account
    await executeMysqlQuery(
      "UPDATE Account SET Deleted = 1 WHERE AccountId = ?",
      [staffId]
    );

    logger.info(`Staff deleted: ${staffId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
  }

  /**
   * Get staff statistics
   * @returns {Promise<Object>} - Staff statistics
   */
  async getStaffStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalStaff,
        SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) as activeStaff,
        SUM(CASE WHEN Status = 'Inactive' THEN 1 ELSE 0 END) as inactiveStaff,
        SUM(CASE WHEN Status = 'OnLeave' THEN 1 ELSE 0 END) as onLeaveStaff,
        AVG(Salary) as averageSalary,
        MIN(Salary) as minSalary,
        MAX(Salary) as maxSalary,
        COUNT(DISTINCT Position) as totalPositions
      FROM Staff 
      WHERE Deleted = 0
    `;

    const result = await executeMysqlQuery(query);
    return result[0];
  }

  /**
   * Get staff by salary range
   * @param {Number} minSalary - Minimum salary
   * @param {Number} maxSalary - Maximum salary
   * @returns {Promise<Array>} - Staff in salary range
   */
  async getStaffBySalaryRange(minSalary, maxSalary) {
    const query = `
      SELECT s.*, a.Email
      FROM Staff s
      LEFT JOIN Account a ON s.StaffId = a.AccountId
      WHERE s.Salary BETWEEN ? AND ?
      AND s.Deleted = 0
      ORDER BY s.Salary DESC
    `;

    const staff = await executeMysqlQuery(query, [minSalary, maxSalary]);
    return staff;
  }

  /**
   * Get positions list
   * @returns {Promise<Array>} - List of positions with counts
   */
  async getPositions() {
    const query = `
      SELECT 
        Position,
        COUNT(*) as count,
        AVG(Salary) as averageSalary
      FROM Staff
      WHERE Deleted = 0
      GROUP BY Position
      ORDER BY count DESC
    `;

    const positions = await executeMysqlQuery(query);
    return positions;
  }

  /**
   * Search staff
   * @param {String} searchTerm - Search term
   * @param {Number} limit - Max results
   * @returns {Promise<Array>} - Matching staff
   */
  async searchStaff(searchTerm, limit = 20) {
    const query = `
      SELECT s.*, a.Email
      FROM Staff s
      LEFT JOIN Account a ON s.StaffId = a.AccountId
      WHERE (s.StaffName LIKE ? OR s.PhoneNumber LIKE ? OR s.Position LIKE ?)
      AND s.Deleted = 0
      ORDER BY s.StaffName ASC
      LIMIT ?
    `;

    const search = `%${searchTerm}%`;
    const staff = await executeMysqlQuery(query, [
      search,
      search,
      search,
      limit,
    ]);

    logger.info(`Search "${searchTerm}" found ${staff.length} staff members`);
    return staff;
  }

  /**
   * Get database connection for transactions
   * @returns {Promise<Connection>}
   */
  async getConnection() {
    const mysql = await import("mysql2/promise");
    const pool = mysql.createPool({
      host: process.env.MySQL_HOST,
      user: process.env.MySQL_USER,
      password: process.env.MySQL_PWD,
      database: process.env.MySQL_DB_NAME,
    });
    return pool.getConnection();
  }
}

export default new StaffService();
