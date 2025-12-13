import authService from "../services/auth.service.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        ERROR_MESSAGES.TOKEN_MISSING,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = authService.verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    next(error);
  }
};

/**
 * Authorization Middleware
 * Checks if user has required role(s)
 * @param {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED)
      );
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user: ${req.user.email}`);
      return next(
        new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

/**
 * Permission Check Middleware
 * Combines authentication and authorization
 * @param {Array} roles - Array of allowed roles
 */
export const checkPermission = (roles = []) => {
  return [authenticate, authorize(...roles)];
};

/**
 * Admin Only Middleware
 * Shorthand for checking admin role
 */
export const adminOnly = [authenticate, authorize(USER_ROLES.ADMIN)];

export default checkPermission;
