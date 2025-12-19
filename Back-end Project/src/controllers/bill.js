import billService from "../services/bill.service.js";
import { createBillSchema, updateBillSchema } from "../schemas/bill.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get All Bills Controller
 * @route GET /api/bill
 * @access Private (Admin, Staff)
 */
export const getAllBills = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

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
    {
      page,
      limit,
      total: result.pagination.total,
      totalPages: Math.ceil(result.pagination.total / limit),
    },
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
 * @route POST /api/bill
 * @access Private (Admin/Staff)
 */
export const createBill = asyncHandler(async (req, res) => {
  // Validate request data
  const { error, value } = createBillSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  // Convert string amounts to numbers
  if (typeof value.TotalAmount === "string") {
    value.TotalAmount = parseFloat(value.TotalAmount);
  }

  const result = await billService.createBill(value);

  return ApiResponse.created(res, result, "Bill created successfully");
});

/**
 * Update Bill Controller
 * @route PUT /api/bill/:id
 * @access Private (Admin/Staff)
 */
export const updateBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request data
  const { error, value } = updateBillSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  // Convert string amounts to numbers
  if (typeof value.TotalAmount === "string") {
    value.TotalAmount = parseFloat(value.TotalAmount);
  }

  const result = await billService.updateBill(id, value);

  return ApiResponse.success(res, null, "Bill updated successfully");
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
 * @route DELETE /api/bill/:id
 * @access Private (Admin)
 */
export const deleteBill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await billService.deleteBill(id);

  return ApiResponse.success(res, null, "Bill deleted successfully");
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
