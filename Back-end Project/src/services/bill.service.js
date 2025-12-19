import { executeMysqlQuery } from "../config/db.js";
import AppError from "../utils/AppError.js";
import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  BILL_STATUS,
} from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Bill Service
 * Handles all bill-related business logic
 */
class BillService {
  /**
   * Get all bills with pagination and filters
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} - Bills data with pagination info
   */
  async getAllBills(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = ["b.Deleted = 0"];
    let queryParams = [];

    if (filters.userId) {
      whereConditions.push("b.UserId = ?");
      queryParams.push(filters.userId);
    }

    if (filters.status) {
      whereConditions.push("b.Status = ?");
      queryParams.push(filters.status);
    }

    if (filters.fromDate) {
      whereConditions.push("b.CreationDate >= ?");
      queryParams.push(filters.fromDate);
    }

    if (filters.toDate) {
      whereConditions.push("b.CreationDate <= ?");
      queryParams.push(filters.toDate);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Bill b WHERE ${whereClause}`;
    const countResult = await executeMysqlQuery(countQuery, queryParams);
    const total = countResult[0].total;

    // Get paginated bills with user info
    const query = `
      SELECT 
        b.*,
        u.UserName,
        u.PhoneNumber as UserPhone
      FROM Bill b
      LEFT JOIN Users u ON b.UserId = u.UserId
      WHERE ${whereClause}
      ORDER BY b.CreationDate DESC
      LIMIT ? OFFSET ?
    `;

    const bills = await executeMysqlQuery(query, [
      ...queryParams,
      limit,
      offset,
    ]);

    logger.info(`Retrieved ${bills.length} bills (page ${page})`);

    return {
      bills,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get bill by ID with details
   * @param {Number} billId - Bill ID
   * @returns {Promise<Object>} - Bill data with details
   */
  async getBillById(billId) {
    const query = `
      SELECT 
        b.*,
        u.UserName,
        u.PhoneNumber as UserPhone
      FROM Bill b
      LEFT JOIN Users u ON b.UserId = u.UserId
      WHERE b.BillId = ? AND b.Deleted = 0
    `;

    const bills = await executeMysqlQuery(query, [billId]);

    if (bills.length === 0) {
      throw new AppError("Bill not found", HTTP_STATUS.NOT_FOUND);
    }

    // Get bill items/details if needed
    const bill = bills[0];

    logger.info(`Retrieved bill: ${billId}`);
    return bill;
  }

  /**
   * Get bills by user ID
   * @param {Number} userId - User ID
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Promise<Object>} - User's bills
   */
  async getBillsByUserId(userId, page = 1, limit = 10) {
    return this.getAllBills(page, limit, { userId });
  }

  /**
   * Create new bill
   * @param {Object} billData - Bill data
   * @returns {Promise<Object>} - Created bill info
   */
  async createBill(billData) {
    // Validate user exists
    const userExists = await this.validateUser(billData.UserId);
    if (!userExists) {
      throw new AppError("User does not exist", HTTP_STATUS.BAD_REQUEST);
    }

    // Validate total amount
    if (billData.TotalAmount <= 0) {
      throw new AppError(
        "Total amount must be greater than 0",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const bill = {
      UserId: billData.UserId,
      CreationDate:
        billData.CreationDate ||
        new Date().toISOString().slice(0, 19).replace("T", " "),
      TotalAmount: billData.TotalAmount,
      Status: billData.Status || BILL_STATUS.PENDING,
      Note: billData.Note || "",
      Deleted: false,
    };

    const query = `
      INSERT INTO Bill (UserId, CreationDate, TotalAmount, Status, Note, Deleted)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await executeMysqlQuery(query, [
      bill.UserId,
      bill.CreationDate,
      bill.TotalAmount,
      bill.Status,
      bill.Note,
      bill.Deleted,
    ]);

    logger.info(
      `Bill created with ID: ${result.insertId} for user: ${bill.UserId}`
    );

    return {
      message: SUCCESS_MESSAGES.CREATED,
      billId: result.insertId,
    };
  }

  /**
   * Update bill
   * @param {Number} billId - Bill ID
   * @param {Object} billData - Updated bill data
   * @returns {Promise<Object>} - Success message
   */
  async updateBill(billId, billData) {
    // Check if bill exists
    const existingBill = await this.getBillById(billId);

    // Don't allow updating paid bills
    if (existingBill.Status === BILL_STATUS.PAID) {
      throw new AppError("Cannot update paid bill", HTTP_STATUS.BAD_REQUEST);
    }

    // Validate user if changed
    if (billData.UserId && billData.UserId !== existingBill.UserId) {
      const userExists = await this.validateUser(billData.UserId);
      if (!userExists) {
        throw new AppError("User does not exist", HTTP_STATUS.BAD_REQUEST);
      }
    }

    const query = `
      UPDATE Bill 
      SET UserId = ?, 
          CreationDate = ?, 
          TotalAmount = ?, 
          Status = ?, 
          Note = ?
      WHERE BillId = ?
    `;

    const result = await executeMysqlQuery(query, [
      billData.UserId,
      billData.CreationDate,
      billData.TotalAmount,
      billData.Status,
      billData.Note,
      billId,
    ]);

    if (result.affectedRows === 0) {
      throw new AppError("Bill not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Bill updated: ${billId}`);

    return {
      message: SUCCESS_MESSAGES.UPDATED,
    };
  }

  /**
   * Update bill status
   * @param {Number} billId - Bill ID
   * @param {String} status - New status
   * @returns {Promise<Object>} - Success message
   */
  async updateBillStatus(billId, status) {
    // Validate status
    const validStatuses = Object.values(BILL_STATUS);
    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid bill status", HTTP_STATUS.BAD_REQUEST);
    }

    // Check if bill exists
    await this.getBillById(billId);

    const query = "UPDATE Bill SET Status = ? WHERE BillId = ?";
    await executeMysqlQuery(query, [status, billId]);

    logger.info(`Bill ${billId} status updated to: ${status}`);

    return {
      message: "Bill status updated successfully",
    };
  }

  /**
   * Mark bill as paid
   * @param {Number} billId - Bill ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} - Success message
   */
  async markBillAsPaid(billId, paymentData = {}) {
    const bill = await this.getBillById(billId);

    if (bill.Status === BILL_STATUS.PAID) {
      throw new AppError("Bill is already paid", HTTP_STATUS.BAD_REQUEST);
    }

    // Update bill status
    await this.updateBillStatus(billId, BILL_STATUS.PAID);

    // Log payment (you might want to create a Payment record here)
    logger.info(`Bill ${billId} marked as paid. Amount: ${bill.TotalAmount}`);

    return {
      message: "Bill marked as paid successfully",
      billId,
      amount: bill.TotalAmount,
    };
  }

  /**
   * Delete bill (soft delete)
   * @param {Number} billId - Bill ID
   * @returns {Promise<Object>} - Success message
   */
  async deleteBill(billId) {
    // Check if bill exists
    const bill = await this.getBillById(billId);

    // Don't allow deleting paid bills
    if (bill.Status === BILL_STATUS.PAID) {
      throw new AppError("Cannot delete paid bill", HTTP_STATUS.BAD_REQUEST);
    }

    const query = "UPDATE Bill SET Deleted = 1 WHERE BillId = ?";
    const result = await executeMysqlQuery(query, [billId]);

    if (result.affectedRows === 0) {
      throw new AppError("Bill not found", HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`Bill deleted: ${billId}`);

    return {
      message: SUCCESS_MESSAGES.DELETED,
    };
  }

  /**
   * Validate if user exists
   * @param {Number} userId - User ID
   * @returns {Promise<Boolean>}
   */
  async validateUser(userId) {
    const query = "SELECT UserId FROM Users WHERE UserId = ? AND Deleted = 0";
    const result = await executeMysqlQuery(query, [userId]);
    return result.length > 0;
  }

  /**
   * Get bill statistics
   * @param {Object} filters - Optional filters (userId, dateRange)
   * @returns {Promise<Object>} - Bill statistics
   */
  async getBillStatistics(filters = {}) {
    let whereConditions = ["Deleted = 0"];
    let queryParams = [];

    if (filters.userId) {
      whereConditions.push("UserId = ?");
      queryParams.push(filters.userId);
    }

    if (filters.fromDate) {
      whereConditions.push("CreationDate >= ?");
      queryParams.push(filters.fromDate);
    }

    if (filters.toDate) {
      whereConditions.push("CreationDate <= ?");
      queryParams.push(filters.toDate);
    }

    const whereClause = whereConditions.join(" AND ");

    const query = `
      SELECT 
        COUNT(*) as totalBills,
        SUM(CASE WHEN Status = 'Paid' THEN 1 ELSE 0 END) as paidBills,
        SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) as pendingBills,
        SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledBills,
        SUM(TotalAmount) as totalRevenue,
        SUM(CASE WHEN Status = 'Paid' THEN TotalAmount ELSE 0 END) as paidRevenue,
        AVG(TotalAmount) as averageBillAmount
      FROM Bill 
      WHERE ${whereClause}
    `;

    const result = await executeMysqlQuery(query, queryParams);
    return result[0];
  }

  /**
   * Get monthly revenue report
   * @param {Number} year - Year
   * @returns {Promise<Array>} - Monthly revenue data
   */
  async getMonthlyRevenue(year) {
    const query = `
      SELECT 
        MONTH(CreationDate) as month,
        COUNT(*) as billCount,
        SUM(TotalAmount) as revenue
      FROM Bill
      WHERE YEAR(CreationDate) = ? 
      AND Status = 'Paid'
      AND Deleted = 0
      GROUP BY MONTH(CreationDate)
      ORDER BY month
    `;

    const result = await executeMysqlQuery(query, [year]);
    return result;
  }
}

export default new BillService();
