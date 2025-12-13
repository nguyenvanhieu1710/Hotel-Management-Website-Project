import { HTTP_STATUS } from "../constants/index.js";

/**
 * Standard API Response Formatter
 */
class ApiResponse {
  /**
   * Success Response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {String} message - Success message
   * @param {Number} statusCode - HTTP status code
   */
  static success(
    res,
    data = null,
    message = "Success",
    statusCode = HTTP_STATUS.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Error Response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {*} errors - Validation errors or additional error details
   */
  static error(
    res,
    message = "Error",
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors = null
  ) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Created Response (201)
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {String} message - Success message
   */
  static created(res, data = null, message = "Created successfully") {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Paginated Response
   * @param {Object} res - Express response object
   * @param {Array} data - Array of data
   * @param {Object} pagination - Pagination object with page, limit, total, totalPages
   * @param {String} message - Success message
   */
  static paginated(res, data, pagination, message = "Success") {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;
