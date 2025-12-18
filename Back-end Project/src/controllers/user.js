import userService from "../services/user.service.js";
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from "../constants/index.js";

/**
 * Get All Users Controller
 * @route GET /api/users
 * @access Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  const result = await userService.getAllUsers(page, limit);

  return ApiResponse.paginated(
    res,
    result.users,
    page,
    limit,
    result.pagination.total,
    "Users retrieved successfully"
  );
});

/**
 * Get User By ID Controller
 * @route GET /api/users/:id
 * @access Private
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  return ApiResponse.success(res, user, "User retrieved successfully");
});

/**
 * Create User Controller
 * @route POST /api/users
 * @access Private (Admin)
 */
export const createUser = asyncHandler(async (req, res) => {
  // Validate request data
  const { error } = createUserSchema.validate(req.body, { abortEarly: false });
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

  const result = await userService.createUser(req.body);

  return ApiResponse.success(res, result, result.message, HTTP_STATUS.CREATED);
});

/**
 * Update User Controller
 * @route PUT /api/users/:id
 * @access Private
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request data
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
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

  const result = await userService.updateUser(id, req.body);

  return ApiResponse.success(res, result, result.message);
});

/**
 * Delete User Controller
 * @route DELETE /api/users/:id
 * @access Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await userService.deleteUser(id);

  return ApiResponse.success(res, null, result.message);
});

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
