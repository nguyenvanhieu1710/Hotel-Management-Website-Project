// User Roles
export const USER_ROLES = {
  ADMIN: "Admin",
  USER: "User",
  STAFF: "Staff",
};

// Account Status
export const ACCOUNT_STATUS = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  BANNED: "Banned",
};

// Gender
export const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// Room Status
export const ROOM_STATUS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
  RESERVED: "Reserved",
};

// Bill Status
export const BILL_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CHECKED_IN: "CheckedIn",
  CHECKED_OUT: "CheckedOut",
  CANCELLED: "Cancelled",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Auth
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already exists",
  EMAIL_NOT_FOUND: "Email not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "You do not have permission to perform this action",
  TOKEN_MISSING: "No token provided",
  TOKEN_INVALID: "Invalid or expired token",

  // Validation
  VALIDATION_ERROR: "Validation error",
  REQUIRED_FIELD: "This field is required",
  INVALID_FORMAT: "Invalid format",

  // Database
  DATABASE_ERROR: "Database error occurred",
  RECORD_NOT_FOUND: "Record not found",
  DUPLICATE_ENTRY: "Duplicate entry",

  // General
  INTERNAL_SERVER_ERROR: "Internal server error",
  BAD_REQUEST: "Bad request",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "Registration successful",
  LOGOUT_SUCCESS: "Logout successful",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Default Values
export const DEFAULTS = {
  PASSWORD: "123456",
  USER_IMAGE: "default.jpg",
  ACCOUNT_NAME: "User",
  ADDRESS: "Not provided",
  PHONE_NUMBER: "Not provided",
  IDENTIFICATION_NUMBER: "000000000000",
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  IDENTIFICATION: /^[0-9]{9,12}$/,
};

// Date Formats
export const DATE_FORMATS = {
  MYSQL_DATETIME: "YYYY-MM-DD HH:mm:ss",
  MYSQL_DATE: "YYYY-MM-DD",
  DISPLAY: "DD/MM/YYYY",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm:ss",
};
