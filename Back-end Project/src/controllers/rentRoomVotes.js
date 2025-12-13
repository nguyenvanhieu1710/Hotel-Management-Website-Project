import { executeMysqlQuery } from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.js";

/**
 * Get all rent room votes with user info
 * @route GET /api/rent-room-votes
 * @access Private (Admin, Staff)
 */
export const getAllRentRoomVotes = asyncHandler(async (req, res) => {
  const { userId, status } = req.query;

  let query = `
    SELECT 
      rrv.*,
      u.FullName as UserName,
      u.Email as UserEmail
    FROM RentRoomVotes rrv
    LEFT JOIN Users u ON rrv.UserId = u.UserId
    WHERE rrv.Deleted = 0
  `;
  const params = [];

  if (userId) {
    query += " AND rrv.UserId = ?";
    params.push(userId);
  }

  if (status) {
    query += " AND rrv.Status = ?";
    params.push(status);
  }

  query += " ORDER BY rrv.ActualCheckinDate DESC";

  const result = await executeMysqlQuery(query, params);

  logger.info(`Retrieved ${result.length} rent room votes`);
  return ApiResponse.success(
    res,
    result,
    "Rent room votes retrieved successfully"
  );
});

/**
 * Get rent room vote by ID
 * @route GET /api/rent-room-votes/:id
 * @access Private (Admin, Staff, Owner)
 */
export const getRentRoomVotesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await executeMysqlQuery(
    `SELECT 
      rrv.*,
      u.FullName as UserName,
      u.Email as UserEmail,
      u.PhoneNumber as UserPhone
    FROM RentRoomVotes rrv
    LEFT JOIN Users u ON rrv.UserId = u.UserId
    WHERE rrv.RentRoomVotesId = ? AND rrv.Deleted = 0`,
    [id]
  );

  if (!result) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Rent Room Vote"), 404);
  }

  logger.info(`Retrieved rent room vote with ID: ${id}`);
  return ApiResponse.success(
    res,
    result,
    "Rent room vote retrieved successfully"
  );
});

/**
 * Create new rent room vote
 * @route POST /api/rent-room-votes
 * @access Private (Admin, Staff)
 */
export const createRentRoomVotes = asyncHandler(async (req, res) => {
  const {
    UserId,
    ActualCheckinDate,
    ActualCheckoutDate,
    TotalAmount,
    Status = "Active",
    Note,
  } = req.body;

  // Validate dates
  if (new Date(ActualCheckoutDate) <= new Date(ActualCheckinDate)) {
    throw new AppError("Checkout date must be after checkin date", 400);
  }

  const result = await executeMysqlQuery(
    `INSERT INTO RentRoomVotes (
      UserId,
      ActualCheckinDate,
      ActualCheckoutDate,
      TotalAmount,
      Status,
      Note,
      Deleted
    ) VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [UserId, ActualCheckinDate, ActualCheckoutDate, TotalAmount, Status, Note]
  );

  logger.info(`Rent room vote created with ID: ${result.insertId}`);
  return ApiResponse.created(
    res,
    { RentRoomVotesId: result.insertId },
    SUCCESS_MESSAGES.CREATED
  );
});

/**
 * Update rent room vote
 * @route PUT /api/rent-room-votes/:id
 * @access Private (Admin, Staff)
 */
export const updateRentRoomVotes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    UserId,
    ActualCheckinDate,
    ActualCheckoutDate,
    TotalAmount,
    Status,
    Note,
  } = req.body;

  // Validate dates if provided
  if (
    ActualCheckinDate &&
    ActualCheckoutDate &&
    new Date(ActualCheckoutDate) <= new Date(ActualCheckinDate)
  ) {
    throw new AppError("Checkout date must be after checkin date", 400);
  }

  const result = await executeMysqlQuery(
    `UPDATE RentRoomVotes SET
      UserId = ?,
      ActualCheckinDate = ?,
      ActualCheckoutDate = ?,
      TotalAmount = ?,
      Status = ?,
      Note = ?
    WHERE RentRoomVotesId = ? AND Deleted = 0`,
    [
      UserId,
      ActualCheckinDate,
      ActualCheckoutDate,
      TotalAmount,
      Status,
      Note,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Rent Room Vote"), 404);
  }

  logger.info(`Rent room vote updated: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete rent room vote (soft delete)
 * @route DELETE /api/rent-room-votes/:id
 * @access Private (Admin)
 */
export const deleteRentRoomVotes = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await executeMysqlQuery(
    "UPDATE RentRoomVotes SET Deleted = 1 WHERE RentRoomVotesId = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Rent Room Vote"), 404);
  }

  logger.info(`Rent room vote soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});
