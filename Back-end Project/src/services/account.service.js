import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * Account Service
 * Handles all business logic for account management
 */
class AccountService {
  /**
   * Get all accounts with pagination and filters
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @param {string} options.role - Filter by role
   * @param {string} options.status - Filter by status
   * @param {string} options.search - Search by name or email
   * @returns {Promise<Object>} Paginated accounts with metadata
   */
  async getAllAccounts(options = {}) {
    const { page = 1, limit = 10, role, status, search } = options;

    const offset = (page - 1) * limit;
    let whereConditions = ["Deleted = 0"];
    let params = [];

    // Build WHERE conditions
    if (role) {
      whereConditions.push("Role = ?");
      params.push(role);
    }

    if (status) {
      whereConditions.push("Status = ?");
      params.push(status);
    }

    if (search) {
      whereConditions.push("(AccountName LIKE ? OR Email LIKE ?)");
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM Account
      WHERE ${whereClause}
    `;
    const [countResult] = await executeMysqlQuery(countQuery, params);
    const total = countResult.total;

    // Get paginated data (exclude password)
    const dataQuery = `
      SELECT 
        AccountId, AccountName, Role, Email, Status, CreationDate, Deleted
      FROM Account
      WHERE ${whereClause}
      ORDER BY CreationDate DESC
      LIMIT ? OFFSET ?
    `;
    const accounts = await executeMysqlQuery(dataQuery, [
      ...params,
      limit,
      offset,
    ]);

    return {
      data: accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get account by ID
   * @param {number} accountId - Account ID
   * @returns {Promise<Object>} Account details (without password)
   */
  async getAccountById(accountId) {
    const query = `
      SELECT 
        AccountId, AccountName, Role, Email, Status, CreationDate, Deleted
      FROM Account
      WHERE AccountId = ? AND Deleted = 0
    `;
    const [account] = await executeMysqlQuery(query, [accountId]);

    if (!account) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Account"), 404);
    }

    return account;
  }

  /**
   * Get account by email (with password for authentication)
   * @param {string} email - Email address
   * @returns {Promise<Object>} Account with password
   */
  async getAccountByEmail(email) {
    const query = `
      SELECT *
      FROM Account
      WHERE Email = ? AND Deleted = 0
    `;
    const [account] = await executeMysqlQuery(query, [email]);

    return account || null;
  }

  /**
   * Create new account with user/staff profile
   * @param {Object} accountData - Account data
   * @returns {Promise<Object>} Created account
   */
  async createAccount(accountData) {
    const {
      AccountName,
      Password,
      Role,
      Email,
      Status = "Active",
      CreationDate,
      // Additional data for User/Staff
      DateOfBirth,
      WorkStartDate,
    } = accountData;

    // Check if email already exists
    const existingAccount = await this.getAccountByEmail(Email);
    if (existingAccount) {
      throw new AppError("Email already exists", 400);
    }

    // Validate role
    const validRoles = ["Admin", "Staff", "Customer"];
    if (!validRoles.includes(Role)) {
      throw new AppError(`Invalid role: ${Role}`, 400);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(Password, salt);

    // Format creation date
    const creationDate = CreationDate
      ? new Date(CreationDate).toISOString().slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");

    // Insert account
    const insertQuery = `
      INSERT INTO Account 
      (AccountName, Password, Role, Email, Status, CreationDate, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    const result = await executeMysqlQuery(insertQuery, [
      AccountName,
      hashedPassword,
      Role,
      Email,
      Status,
      creationDate,
    ]);

    const accountId = result.insertId;

    // Create associated User or Staff profile
    if (Role === "Customer") {
      await this.createUserProfile(accountId, AccountName);
    } else if (Role === "Staff") {
      await this.createStaffProfile(
        accountId,
        AccountName,
        DateOfBirth,
        WorkStartDate
      );
    }

    logger.info(`Account created with ID: ${accountId}, Role: ${Role}`);
    return await this.getAccountById(accountId);
  }

  /**
   * Create user profile for customer account
   * @param {number} accountId - Account ID
   * @param {string} accountName - Account name
   * @returns {Promise<void>}
   */
  async createUserProfile(accountId, accountName) {
    const query = `
      INSERT INTO Users 
      (UserId, IdentificationNumber, UserName, DateOfBirth, Gender, PhoneNumber, Address, UserImage, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    await executeMysqlQuery(query, [
      accountId,
      "000000000000", // Default ID number
      accountName,
      "2000-01-01", // Default DOB
      "Other", // Default gender
      "0000000000", // Default phone
      "Not provided", // Default address
      "default-user.jpg", // Default user image
    ]);

    logger.info(`User profile created for account: ${accountId}`);
  }

  /**
   * Create staff profile for staff account
   * @param {number} accountId - Account ID
   * @param {string} accountName - Account name
   * @param {string} dateOfBirth - Date of birth
   * @param {string} workStartDate - Work start date
   * @returns {Promise<void>}
   */
  async createStaffProfile(accountId, accountName, dateOfBirth, workStartDate) {
    const dob = dateOfBirth
      ? new Date(dateOfBirth).toISOString().slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");

    const startDate = workStartDate
      ? new Date(workStartDate).toISOString().slice(0, 19).replace("T", " ")
      : new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = `
      INSERT INTO Staff 
      (StaffId, StaffName, DateOfBirth, Gender, PhoneNumber, Address, Position, 
       Salary, Status, WorkStartDate, Description, StaffImage, Deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    await executeMysqlQuery(query, [
      accountId,
      accountName,
      dob,
      "Other", // Default gender
      "0000000000", // Default phone
      "Not provided", // Default address
      "Staff", // Default position
      0, // Default salary
      "Active", // Default status
      startDate,
      "New staff member", // Default description
      "default-staff.jpg", // Default staff image
    ]);

    logger.info(`Staff profile created for account: ${accountId}`);
  }

  /**
   * Update account
   * @param {number} accountId - Account ID
   * @param {Object} accountData - Updated account data
   * @returns {Promise<Object>} Updated account
   */
  async updateAccount(accountId, accountData) {
    // Check if account exists
    await this.getAccountById(accountId);

    const { AccountName, Password, Role, Email, Status } = accountData;

    // Check if email is being changed and if it's already taken
    if (Email) {
      const existingAccount = await this.getAccountByEmail(Email);
      logger.info(
        `Update account ${accountId}: Email check - existing account: ${
          existingAccount ? existingAccount.AccountId : "none"
        }, current account: ${accountId}`
      );

      if (
        existingAccount &&
        existingAccount.AccountId !== parseInt(accountId)
      ) {
        throw new AppError("Email already exists", 400);
      }
    }

    // Hash password if provided
    let hashedPassword = null;
    if (Password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(Password, salt);
    }

    // Build update query dynamically
    let updateFields = [];
    let params = [];

    if (AccountName) {
      updateFields.push("AccountName = ?");
      params.push(AccountName);
    }

    if (hashedPassword) {
      updateFields.push("Password = ?");
      params.push(hashedPassword);
    }

    if (Role) {
      updateFields.push("Role = ?");
      params.push(Role);
    }

    if (Email) {
      updateFields.push("Email = ?");
      params.push(Email);
    }

    if (Status) {
      updateFields.push("Status = ?");
      params.push(Status);
    }

    if (updateFields.length === 0) {
      throw new AppError("No fields to update", 400);
    }

    params.push(accountId);

    const updateQuery = `
      UPDATE Account
      SET ${updateFields.join(", ")}
      WHERE AccountId = ?
    `;

    await executeMysqlQuery(updateQuery, params);

    logger.info(`Account updated: ${accountId}`);
    return await this.getAccountById(accountId);
  }

  /**
   * Update account status
   * @param {number} accountId - Account ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated account
   */
  async updateAccountStatus(accountId, status) {
    // Validate status
    const validStatuses = ["Active", "Inactive", "Suspended"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const query = `
      UPDATE Account
      SET Status = ?
      WHERE AccountId = ? AND Deleted = 0
    `;

    const result = await executeMysqlQuery(query, [status, accountId]);

    if (result.affectedRows === 0) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Account"), 404);
    }

    logger.info(`Account ${accountId} status updated to: ${status}`);
    return await this.getAccountById(accountId);
  }

  /**
   * Delete account (soft delete)
   * @param {number} accountId - Account ID
   * @returns {Promise<void>}
   */
  async deleteAccount(accountId) {
    // Check if account exists
    await this.getAccountById(accountId);

    const query = `
      UPDATE Account
      SET Deleted = 1
      WHERE AccountId = ?
    `;

    await executeMysqlQuery(query, [accountId]);
    logger.info(`Account soft deleted: ${accountId}`);
  }

  /**
   * Get account statistics
   * @returns {Promise<Object>} Account statistics
   */
  async getAccountStatistics() {
    const query = `
      SELECT 
        COUNT(*) as totalAccounts,
        SUM(CASE WHEN Role = 'Admin' THEN 1 ELSE 0 END) as adminAccounts,
        SUM(CASE WHEN Role = 'Staff' THEN 1 ELSE 0 END) as staffAccounts,
        SUM(CASE WHEN Role = 'Customer' THEN 1 ELSE 0 END) as customerAccounts,
        SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END) as activeAccounts,
        SUM(CASE WHEN Status = 'Inactive' THEN 1 ELSE 0 END) as inactiveAccounts,
        SUM(CASE WHEN Status = 'Suspended' THEN 1 ELSE 0 END) as suspendedAccounts
      FROM Account
      WHERE Deleted = 0
    `;

    const [stats] = await executeMysqlQuery(query);
    return stats;
  }

  /**
   * Send contact email
   * @param {Object} emailData - Email data
   * @param {string} emailData.name - Sender name
   * @param {string} emailData.email - Sender email
   * @param {string} emailData.message - Message content
   * @returns {Promise<Object>} Email send result
   */
  async sendContactEmail(emailData) {
    const { name, email, message } = emailData;

    // Validate email data
    if (!name || !email || !message) {
      throw new AppError("Name, email, and message are required", 400);
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD_OF_EMAIL,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: process.env.EMAIL_OF_RECIPIENT,
      subject: `Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Contact email sent from: ${email}`);
      return {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error(`Email sending error: ${error.message}`);
      throw new AppError(`Failed to send email: ${error.message}`, 500);
    }
  }

  /**
   * Change account password
   * @param {number} accountId - Account ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(accountId, oldPassword, newPassword) {
    // Get account with password
    const query = `
      SELECT *
      FROM Account
      WHERE AccountId = ? AND Deleted = 0
    `;
    const [account] = await executeMysqlQuery(query, [accountId]);

    if (!account) {
      throw new AppError(ERROR_MESSAGES.NOT_FOUND("Account"), 404);
    }

    // Verify old password
    const isPasswordValid = await bcryptjs.compare(
      oldPassword,
      account.Password
    );
    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 400);
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update password
    const updateQuery = `
      UPDATE Account
      SET Password = ?
      WHERE AccountId = ?
    `;

    await executeMysqlQuery(updateQuery, [hashedPassword, accountId]);
    logger.info(`Password changed for account: ${accountId}`);
  }
}

export default new AccountService();
