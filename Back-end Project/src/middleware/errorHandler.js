import logger from "../utils/logger.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Handle Joi Validation Errors
 */
const handleJoiError = (error) => {
  const errors = error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message,
  }));

  return new AppError(
    ERROR_MESSAGES.VALIDATION_ERROR,
    HTTP_STATUS.BAD_REQUEST,
    errors
  );
};

/**
 * Handle MySQL Errors
 */
const handleMySQLError = (error) => {
  // Duplicate entry error
  if (error.code === "ER_DUP_ENTRY") {
    return new AppError(ERROR_MESSAGES.DUPLICATE_ENTRY, HTTP_STATUS.CONFLICT);
  }

  // Foreign key constraint error
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return new AppError(
      "Referenced record does not exist",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Default database error
  return new AppError(
    ERROR_MESSAGES.DATABASE_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
  return new AppError(ERROR_MESSAGES.TOKEN_INVALID, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Handle JWT Expired Error
 */
const handleJWTExpiredError = () => {
  return new AppError(
    "Token has expired, please login again",
    HTTP_STATUS.UNAUTHORIZED
  );
};

/**
 * Send Error Response in Development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Send Error Response in Production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }
  // Programming or unknown error: don't leak error details
  else {
    // Log error
    logger.error("ERROR 💥", err);

    // Send generic message
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  // Log error
  logger.error(
    `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === "ValidationError") error = handleJoiError(err);
    if (err.code && err.code.startsWith("ER_")) error = handleMySQLError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found
 */
export const notFoundHandler = (req, res, next) => {
  const err = new AppError(
    `Cannot find ${req.originalUrl} on this server`,
    HTTP_STATUS.NOT_FOUND
  );
  next(err);
};

export default errorHandler;
