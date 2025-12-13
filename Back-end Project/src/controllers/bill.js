import billService from "../services/bill.service.js";
import { billSchema } from "../schemas/bill.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from "../constants/index.js";

/**
 * Get All Bills Controller
 * @route GET /api/bills
 * @access Private (Admin)
 */
export const getAllBills = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  // Extract filters from query
  const filters = {
    userId: req.query.userId,
    status: req.query.status,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
  };

  const result = await billService.getAllBills(page, limit, filters);

  return ApiResponse.paginated(
    res,
    result.bills,
    page,
    limit,
    result.pagination.total,
    "Bills retrieved successfully"
  );
});

/**
 * Get Bill By ID Controller
 * @route GET /api/bills/:id
 * @access Private
 */
export const getBillById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bill = await billService.getBillById(id);

  return ApiResponse.success(res, bill, "Bill retrieved successfully");
});

/**
 * Get Bills By User ID Controller
 * @route GET /api/bills/user/:userId
 * @access Private
 */
export const getBillsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  const result = await billService.getBillsByUserId(userId, page, limit);

  return ApiResponse.paginated(
    res,
    result.bills,
    page,
    limit,
    result.pagination.total,
    "User bills retrieved successfully"
  );
});

/**
 * Create Bill Controller
 * @route POST /api/bills
 * @access Private (Admin/Staff)
 */
export const createBill = asyncHandler(async (req, res) => {
  // Validate request data
  const { error } = billSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    throw new AppError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const result = await billService.createBill(req.body);

  return ApiResponse.success(res, result, result.message, HTTP_STATUS.CREATED);
});

/**
 * Update Bill Controller
 * @route PUT /api/bills/:id
 * @access Private (Admin/Staff)
 */
export const updateBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request data
  const { error } = billSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    throw new AppError(
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      errors
    );
  }

  const result = await billService.updateBill(id, req.body);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Update Bill Status Controller
 * @route PATCH /api/bills/:id/status
 * @access Private (Admin/Staff)
 */
export const updateBillStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError("Status is required", HTTP_STATUS.BAD_REQUEST);
  }

  const result = await billService.updateBillStatus(id, status);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Mark Bill As Paid Controller
 * @route POST /api/bills/:id/pay
 * @access Private (Admin/Staff)
 */
export const markBillAsPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const paymentData = req.body;

  const result = await billService.markBillAsPaid(id, paymentData);

  return ApiResponse.success(res, result, result.message);
});

/**
 * Delete Bill Controller
 * @route DELETE /api/bills/:id
 * @access Private (Admin)
 */
export const deleteBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await billService.deleteBill(id);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Get Bill Statistics Controller
 * @route GET /api/bills/statistics
 * @access Private (Admin)
 */
export const getBillStatistics = asyncHandler(async (req, res) => {
  const filters = {
    userId: req.query.userId,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
  };

  const statistics = await billService.getBillStatistics(filters);

  return ApiResponse.success(
    res,
    statistics,
    "Bill statistics retrieved successfully"
  );
});

/**
 * Get Monthly Revenue Controller
 * @route GET /api/bills/revenue/monthly/:year
 * @access Private (Admin)
 */
export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const { year } = req.params;

  if (!year || isNaN(year)) {
    throw new AppError("Valid year is required", HTTP_STATUS.BAD_REQUEST);
  }

  const revenue = await billService.getMonthlyRevenue(parseInt(year));

  return ApiResponse.success(
    res,
    revenue,
    "Monthly revenue retrieved successfully"
  );
});

export default {
  getAllBills,
  getBillById,
  getBillsByUserId,
  createBill,
  updateBill,
  updateBillStatus,
  markBillAsPaid,
  deleteBill,
  getBillStatistics,
  getMonthlyRevenue,
};
