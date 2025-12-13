import AccountService from "../services/account.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";

/**
 * Get all accounts with pagination and filters
 * @route GET /api/account
 * @access Private (Admin)
 */
export const getAccounts = asyncHandler(async (req, res) => {
  const { page, limit, role, status, search } = req.query;

  const result = await AccountService.getAllAccounts({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    role,
    status,
    search,
  });

  logger.info(`Retrieved ${result.data.length} accounts`);
  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Accounts retrieved successfully"
  );
});

/**
 * Get account by ID
 * @route GET /api/account/:id
 * @access Private (Admin, Owner)
 */
export const getAccountById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const account = await AccountService.getAccountById(id);

  logger.info(`Retrieved account with ID: ${id}`);
  return ApiResponse.success(res, account, "Account retrieved successfully");
});

/**
 * Create new account
 * @route POST /api/account
 * @access Private (Admin)
 */
export const createAccount = asyncHandler(async (req, res) => {
  const account = await AccountService.createAccount(req.body);

  logger.info(`Account created with ID: ${account.AccountId}`);
  return ApiResponse.created(res, account, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update account
 * @route PUT /api/account/:id
 * @access Private (Admin, Owner)
 */
export const updateAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const account = await AccountService.updateAccount(id, req.body);

  logger.info(`Account updated: ${id}`);
  return ApiResponse.success(res, account, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete account (soft delete)
 * @route DELETE /api/account/:id
 * @access Private (Admin)
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await AccountService.deleteAccount(id);

  logger.info(`Account soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Send contact email
 * @route POST /api/account/send-email
 * @access Public
 */
export const sendEmail = asyncHandler(async (req, res) => {
  const result = await AccountService.sendContactEmail(req.body);

  logger.info(`Contact email sent from: ${req.body.email}`);
  return ApiResponse.success(res, result, "Email sent successfully");
});

/**
 * Get account statistics
 * @route GET /api/account/statistics/summary
 * @access Private (Admin)
 */
export const getAccountStatistics = asyncHandler(async (req, res) => {
  const stats = await AccountService.getAccountStatistics();

  logger.info("Retrieved account statistics");
  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});

/**
 * Update account status
 * @route PUT /api/account/:id/status
 * @access Private (Admin)
 */
export const updateAccountStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const account = await AccountService.updateAccountStatus(id, status);

  logger.info(`Account ${id} status updated to: ${status}`);
  return ApiResponse.success(res, account, "Status updated successfully");
});

/**
 * Change account password
 * @route PUT /api/account/:id/change-password
 * @access Private (Owner)
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  await AccountService.changePassword(id, oldPassword, newPassword);

  logger.info(`Password changed for account: ${id}`);
  return ApiResponse.success(res, null, "Password changed successfully");
});
