import { executeMysqlQuery } from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/index.js";
import {
  createRentRoomVoteSchema,
  updateRentRoomVoteSchema,
} from "../schemas/rentRoomVotes.js";

/**
 * Get all rent room votes with pagination and filters
 * @route GET /api/rent-room-votes
 * @access Private (Admin, Staff)
 */
export const getAllRentRoomVotes = asyncHandler(async (req, res) => {
  const { page, limit, userId, status } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  let whereConditions = ["rrv.Deleted = 0"];
  let params = [];

  if (userId) {
    whereConditions.push("rrv.UserId = ?");
    params.push(userId);
  }

  if (status) {
    whereConditions.push("rrv.Status = ?");
    params.push(status);
  }

  const whereClause = whereConditions.join(" AND ");

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM RentRoomVotes rrv
    WHERE ${whereClause}
  `;
  const [countResult] = await executeMysqlQuery(countQuery, params);
  const total = countResult.total;

  // Get paginated data
  const dataQuery = `
    SELECT 
      rrv.*,
      u.UserName,
      u.PhoneNumber as UserPhone
    FROM RentRoomVotes rrv
    LEFT JOIN Users u ON rrv.UserId = u.UserId
    WHERE ${whereClause}
    ORDER BY rrv.ActualCheckinDate DESC
    LIMIT ? OFFSET ?
  `;

  const result = await executeMysqlQuery(dataQuery, [
    ...params,
    limitNum,
    offset,
  ]);

  logger.info(`Retrieved ${result.length} rent room votes (page ${pageNum})`);
  logger.info(
    `Retrieved rent room votes - Page: ${pageNum}, Limit: ${limitNum}, Total: ${total}`
  );

  return ApiResponse.paginated(
    res,
    result,
    {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
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
      u.UserName,
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
  // Validate request body
  const { error, value } = createRentRoomVoteSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const {
    UserId,
    ActualCheckinDate,
    ActualCheckoutDate,
    TotalAmount,
    Status,
    Note,
  } = value;

  // Convert string amounts to numbers
  const finalTotalAmount =
    typeof TotalAmount === "string" ? parseFloat(TotalAmount) : TotalAmount;

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
    [
      UserId,
      ActualCheckinDate,
      ActualCheckoutDate,
      finalTotalAmount,
      Status,
      Note,
    ]
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
 * @route PUT /api/rent-room-votes/:id or PUT /api/rent-room-votes/update
 * @access Private (Admin, Staff)
 */
export const updateRentRoomVotes = asyncHandler(async (req, res) => {
  // Handle both RESTful (:id) and legacy (body.RentRoomVotesId) formats
  const rentRoomVoteId = req.params.id || req.body.RentRoomVotesId;
  const {
    RentRoomVotesId,
    UserId,
    ActualCheckinDate,
    ActualCheckoutDate,
    TotalAmount,
    Status,
    Note,
  } = req.body;

  if (!rentRoomVoteId) {
    throw new AppError("Rent Room Vote ID is required", 400);
  }

  // Validate request body
  const { error, value } = updateRentRoomVoteSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const validatedData = value;

  // Convert string amounts to numbers
  const finalTotalAmount =
    typeof validatedData.TotalAmount === "string"
      ? parseFloat(validatedData.TotalAmount)
      : validatedData.TotalAmount;

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
      validatedData.UserId,
      validatedData.ActualCheckinDate,
      validatedData.ActualCheckoutDate,
      finalTotalAmount,
      validatedData.Status,
      validatedData.Note,
      rentRoomVoteId,
    ]
  );

  if (result.affectedRows === 0) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND("Rent Room Vote"), 404);
  }

  logger.info(`Rent room vote updated: ${rentRoomVoteId}`);
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
