import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
 * Authentication Service
 * Handles all authentication-related business logic
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Success message
   */
  async register(userData) {
    const { email, password, ...additionalData } = userData;

    // Start transaction
    const connection = await this.getConnection();

    try {
      await connection.beginTransaction();

      // Check if email already exists
      const existingAccount = await executeMysqlQuery(
        "SELECT AccountId FROM Account WHERE Email = ?",
        [email]
      );

      if (existingAccount.length > 0) {
        throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
      }

      // Hash password
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Create account
      const creationDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const accountResult = await executeMysqlQuery(
        `INSERT INTO Account (AccountName, Password, Role, Email, Status, CreationDate, Deleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          additionalData.accountName || email.split("@")[0],
          hashedPassword,
          USER_ROLES.USER,
          email,
          ACCOUNT_STATUS.OFFLINE,
          creationDate,
          false,
        ]
      );

      const accountId = accountResult.insertId;

      // Create user profile
      const dateOfBirth =
        additionalData.dateOfBirth ||
        new Date("2000-01-01").toISOString().slice(0, 19).replace("T", " ");

      await executeMysqlQuery(
        `INSERT INTO Users (UserId, IdentificationNumber, UserName, UserImage, DateOfBirth, Gender, PhoneNumber, Address, Deleted) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          accountId,
          additionalData.identificationNumber || "000000000000",
          additionalData.userName || email.split("@")[0],
          additionalData.userImage || "default.jpg",
          dateOfBirth,
          additionalData.gender || "Male",
          additionalData.phoneNumber || "Not provided",
          additionalData.address || "Not provided",
          false,
        ]
      );

      await connection.commit();

      logger.info(`New user registered: ${email}`);

      return {
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        accountId,
      };
    } catch (error) {
      await connection.rollback();
      logger.error(`Registration error: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Object>} - Account data with token
   */
  async login(email, password) {
    // Find account by email
    const accounts = await executeMysqlQuery(
      "SELECT * FROM Account WHERE Email = ? AND Deleted = 0",
      [email]
    );

    if (accounts.length === 0) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const account = accounts[0];

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, account.Password);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${email}`);
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Generate JWT token
    const token = this.generateToken({
      accountId: account.AccountId,
      email: account.Email,
      role: account.Role,
    });

    // Update account status to online
    await executeMysqlQuery(
      "UPDATE Account SET Status = ? WHERE AccountId = ?",
      [ACCOUNT_STATUS.ONLINE, account.AccountId]
    );

    logger.info(`User logged in: ${email}`);

    // Remove password from response
    delete account.Password;

    return {
      account: {
        ...account,
        token,
      },
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
    };
  }

  /**
   * Generate JWT token
   * @param {Object} payload - Token payload
   * @returns {String} - JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  }

  /**
   * Verify JWT token
   * @param {String} token - JWT token
   * @returns {Object} - Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_INVALID,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
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

export default new AuthService();
