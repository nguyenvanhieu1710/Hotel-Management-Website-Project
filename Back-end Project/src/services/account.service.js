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
    const validRoles = ["Admin", "Staff", "User"];
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
    if (Role === "User") {
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
   * Create user profile for user account
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
        SUM(CASE WHEN Role = 'User' THEN 1 ELSE 0 END) as userAccounts,
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
   * Send booking confirmation email
   * @param {Object} bookingData - Booking information
   * @param {string} bookingData.customerEmail - Customer email
   * @param {string} bookingData.customerName - Customer name
   * @param {Object} bookingData.booking - Booking details
   * @param {Object} bookingData.room - Room details
   * @returns {Promise<Object>} Email send result
   */
  async sendBookingConfirmationEmail(bookingData) {
    const { customerEmail, customerName, booking, room } = bookingData;

    // Debug logging
    console.log("Sending booking email to:", customerEmail);
    console.log("Customer name:", customerName);
    console.log("Booking ID:", booking.BookingVotesId);
    console.log("Room ID:", room.RoomId);

    // Validate booking data
    if (!customerEmail || !customerName || !booking || !room) {
      throw new AppError(
        "Customer email, name, booking, and room details are required",
        400
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD_OF_EMAIL,
      },
    });

    // Format dates
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: customerEmail,
      subject: `Booking Confirmation - Room ${room.RoomId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffc107; margin: 0;">🏨 Hotel Booking Confirmation</h1>
            <p style="color: #666; margin: 5px 0;">Thank you for choosing our hotel!</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #212529; margin-top: 0;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Booking ID:</td>
                <td style="padding: 8px 0; color: #212529;">#${
                  booking.BookingVotesId || "Pending"
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Guest Name:</td>
                <td style="padding: 8px 0; color: #212529;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Room:</td>
                <td style="padding: 8px 0; color: #212529;">Room ${
                  room.RoomId
                } - Floor ${room.NumberOfFloor}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Check-in:</td>
                <td style="padding: 8px 0; color: #212529;">${formatDate(
                  booking.CheckinDate
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Check-out:</td>
                <td style="padding: 8px 0; color: #212529;">${formatDate(
                  booking.CheckoutDate
                )}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Total Amount:</td>
                <td style="padding: 8px 0; color: #ffc107; font-weight: bold; font-size: 18px;">$${
                  booking.TotalAmount
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${booking.Status || "Unpaid"}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #212529; margin-top: 0;">Room Information</h3>
            <p style="margin: 5px 0;"><strong>Room Area:</strong> ${
              room.RoomArea
            } m²</p>
            <p style="margin: 5px 0;"><strong>Amenities:</strong> ${
              room.Amenities || "Standard amenities"
            }</p>
            <p style="margin: 5px 0;"><strong>Description:</strong> ${
              room.Description || "Comfortable room with modern facilities"
            }</p>
          </div>

          ${
            booking.Note
              ? `
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="color: #212529; margin-top: 0;">Special Requests</h4>
            <p style="margin: 0; color: #495057;">${booking.Note}</p>
          </div>
          `
              : ""
          }

          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #155724; margin-top: 0;">📋 Next Steps</h3>
            <ul style="margin: 10px 0; padding-left: 20px; color: #155724;">
              <li>Complete your payment to confirm the booking</li>
              <li>Bring a valid ID for check-in</li>
              <li>Arrive after 2:00 PM on your check-in date</li>
              <li>Check-out before 11:00 AM on your departure date</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin: 5px 0;">Need help? Contact us:</p>
            <p style="color: #ffc107; font-weight: bold; margin: 5px 0;">📞 +84 0984605263</p>
            <p style="color: #ffc107; font-weight: bold; margin: 5px 0;">📧 nguyenvanhieu@gmail.com</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Booking confirmation email sent to: ${customerEmail}`);
      return {
        success: true,
        message: "Booking confirmation email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error(`Booking email sending error: ${error.message}`);
      throw new AppError(
        `Failed to send booking confirmation email: ${error.message}`,
        500
      );
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
