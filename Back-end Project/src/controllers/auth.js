import authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../schemas/auth.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Register Controller
 * @route POST /api/auth/register
 * @access Public
 */
export const Register = asyncHandler(async (req, res) => {
  // Validate request data
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
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

  // Register user through service
  const result = await authService.register(req.body);

  // Send success response
  return ApiResponse.success(res, result, result.message, HTTP_STATUS.CREATED);
});

/**
 * Login Controller
 * @route POST /api/auth/login
 * @access Public
 */
export const Login = asyncHandler(async (req, res) => {
  // Validate request data
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
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

  const { email, password } = req.body;

  // Login user through service
  const result = await authService.login(email, password);

  // Send success response
  return ApiResponse.success(res, result.account, result.message);
});
