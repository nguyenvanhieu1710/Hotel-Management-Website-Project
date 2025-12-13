import EvaluationService from "../services/evaluation.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";

/**
 * Get all evaluations with pagination and filters
 * @route GET /api/evaluation
 * @access Private (Admin, Staff)
 */
export const getAllEvaluations = asyncHandler(async (req, res) => {
  const { page, limit, roomId, userId, minRating, status } = req.query;

  const result = await EvaluationService.getAllEvaluations({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    roomId,
    userId,
    minRating,
    status,
  });

  logger.info(`Retrieved ${result.data.length} evaluations`);
  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Evaluations retrieved successfully"
  );
});

/**
 * Get evaluation by ID
 * @route GET /api/evaluation/:id
 * @access Public
 */
export const getEvaluationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const evaluation = await EvaluationService.getEvaluationById(id);

  logger.info(`Retrieved evaluation with ID: ${id}`);
  return ApiResponse.success(
    res,
    evaluation,
    "Evaluation retrieved successfully"
  );
});

/**
 * Create new evaluation
 * @route POST /api/evaluation
 * @access Private (Customer)
 */
export const createEvaluation = asyncHandler(async (req, res) => {
  const evaluation = await EvaluationService.createEvaluation(req.body);

  logger.info(`Evaluation created with ID: ${evaluation.EvaluationId}`);
  return ApiResponse.created(res, evaluation, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update evaluation
 * @route PUT /api/evaluation/:id
 * @access Private (Admin, Owner)
 */
export const updateEvaluation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const evaluation = await EvaluationService.updateEvaluation(id, req.body);

  logger.info(`Evaluation updated: ${id}`);
  return ApiResponse.success(res, evaluation, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete evaluation (soft delete)
 * @route DELETE /api/evaluation/:id
 * @access Private (Admin, Owner)
 */
export const deleteEvaluation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await EvaluationService.deleteEvaluation(id);

  logger.info(`Evaluation soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get evaluations by room ID
 * @route GET /api/evaluation/room/:roomId
 * @access Public
 */
export const getEvaluationsByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { limit, minRating, status } = req.query;

  const evaluations = await EvaluationService.getEvaluationsByRoomId(roomId, {
    limit: parseInt(limit) || 10,
    minRating,
    status,
  });

  logger.info(
    `Retrieved ${evaluations.length} evaluations for room: ${roomId}`
  );
  return ApiResponse.success(
    res,
    evaluations,
    "Room evaluations retrieved successfully"
  );
});

/**
 * Get room rating statistics
 * @route GET /api/evaluation/room/:roomId/stats
 * @access Public
 */
export const getRoomRatingStats = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const stats = await EvaluationService.getRoomRatingStats(roomId);

  logger.info(`Retrieved rating stats for room: ${roomId}`);
  return ApiResponse.success(
    res,
    stats,
    "Room rating statistics retrieved successfully"
  );
});

/**
 * Update evaluation status
 * @route PUT /api/evaluation/:id/status
 * @access Private (Admin, Staff)
 */
export const updateEvaluationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const evaluation = await EvaluationService.updateEvaluationStatus(id, status);

  logger.info(`Evaluation ${id} status updated to: ${status}`);
  return ApiResponse.success(res, evaluation, "Status updated successfully");
});

/**
 * Get evaluation statistics
 * @route GET /api/evaluation/statistics/summary
 * @access Private (Admin, Staff)
 */
export const getEvaluationStatistics = asyncHandler(async (req, res) => {
  const stats = await EvaluationService.getEvaluationStatistics();

  logger.info("Retrieved evaluation statistics");
  return ApiResponse.success(res, stats, "Statistics retrieved successfully");
});
