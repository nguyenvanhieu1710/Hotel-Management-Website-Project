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
 * User Service
 * Handles all user-related business logic
 */
class UserService {
  /**
   * Get all users with pagination
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Promise<Object>} - Users data with pagination info
   */
  async getAllUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await executeMysqlQuery(
      "SELECT COUNT(*) as total FROM Users WHERE Deleted = 0"
    );
    const total = countResult[0].total;

    // Get paginated users
    const users = await executeMysqlQuery(
      "SELECT * FROM Users WHERE Deleted = 0 LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - User data
   */
  async getUserById(userId) {
    const users = await executeMysqlQuery(
      "SELECT * FROM Users WHERE UserId = ? AND Deleted = 0",
      [userId]
    );

    if (users.length === 0) {
      throw new AppError(
        ERROR_MESSAGES.RECORD_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return users[0];
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user info
   */
  async createUser(userData) {
    const connection = await this.getConnection();

    try {
      await connection.beginTransaction();

      // Hash default password
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash("123456", salt);

      // Create account
      const email = `${userData.UserName}@gmail.com`;
      const accountResult = await executeMysqlQuery(
        `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.UserName,
          hashedPassword,
          USER_ROLES.USER,
          email,
          ACCOUNT_STATUS.OFFLINE,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          false,
        ]
      );

      const accountId = accountResult.insertId;

      // Create user
      await executeMysqlQuery(
        `INSERT INTO Users (UserId, IdentificationNumber, UserName, UserImage, DateOfBirth, Gender, PhoneNumber, Address, Deleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accountId,
          userData.IdentificationNumber,
          userData.UserName,
          userData.UserImage || "default.jpg",
          userData.DateOfBirth,
          userData.Gender,
          userData.PhoneNumber,
          userData.Address,
          false,
        ]
      );

      await connection.commit();

      logger.info(`User created: ${userData.UserName}`);

      return {
        message: SUCCESS_MESSAGES.CREATED,
        userId: accountId,
      };
    } catch (error) {
      await connection.rollback();
      logger.error(`Create user error: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Update user
   * @param {Number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Success message
   */
  async updateUser(userId, userData) {
    // Check if user exists
    await this.getUserById(userId);

    await executeMysqlQuery(
      `UPDATE Users 
       SET IdentificationNumber = ?, 
           UserName = ?, 
           UserImage = ?,
           DateOfBirth = ?, 
           Gender = ?, 
           PhoneNumber = ?, 
           Address = ?
       WHERE UserId = ?`,
      [
        userData.IdentificationNumber,
        userData.UserName,
        userData.UserImage,
        userData.DateOfBirth,
        userData.Gender,
        userData.PhoneNumber,
        userData.Address,
        userId,
      ]
    );

    logger.info(`User updated: ${userId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Delete user (soft delete)
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteUser(userId) {
    // Check if user exists
    await this.getUserById(userId);

    await executeMysqlQuery("UPDATE Users SET Deleted = 1 WHERE UserId = ?", [
      userId,
    ]);

    // Also soft delete the account
    await executeMysqlQuery(
      "UPDATE Account SET Deleted = 1 WHERE AccountId = ?",
      [userId]
    );

    logger.info(`User deleted: ${userId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
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

export default new UserService();
