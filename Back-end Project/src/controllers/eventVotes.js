import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import { SUCCESS_MESSAGES } from "../constants/index.js";
import {
  createEventVoteSchema,
  updateEventVoteSchema,
} from "../schemas/eventVotes.js";
import {
  getAllEventVotes,
  getEventVoteById,
  createEventVote,
  updateEventVote,
  deleteEventVote,
  getEventVotesByEventId,
  getEventVotesByUserId,
  getEventVoteStatistics,
} from "../services/eventVotes.service.js";

/**
 * Get all event votes with pagination
 * @route GET /api/event-votes
 * @access Private (Admin, Staff)
 */
export const getAllEventVotesController = asyncHandler(async (req, res) => {
  const { page, limit, eventId, userId } = req.query;

  const result = await getAllEventVotes(page, limit, { eventId, userId });

  logger.info(
    `Retrieved ${result.data.length} event votes (page ${result.pagination.page})`
  );
  logger.info(
    `Retrieved event votes - Page: ${result.pagination.page}, Limit: ${result.pagination.limit}, Total: ${result.pagination.total}`
  );

  return ApiResponse.paginated(
    res,
    result.data,
    result.pagination,
    "Event votes retrieved successfully"
  );
});

/**
 * Get event vote by ID
 * @route GET /api/event-votes/:id
 * @access Private (Admin, Staff, Owner)
 */
export const getEventVotesByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eventVote = await getEventVoteById(id);

  logger.info(`Retrieved event vote with ID: ${id}`);
  return ApiResponse.success(
    res,
    eventVote,
    "Event vote retrieved successfully"
  );
});

/**
 * Create new event vote (event booking)
 * @route POST /api/event-votes
 * @access Private (Customer, Admin)
 */
export const createEventVoteController = asyncHandler(async (req, res) => {
  // Validate request body
  const { error, value } = createEventVoteSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const result = await createEventVote(value);

  logger.info(`Event vote created with ID: ${result.EventVotesId}`);
  return ApiResponse.created(res, result, SUCCESS_MESSAGES.CREATED);
});

/**
 * Update event vote
 * @route PUT /api/event-votes/:id
 * @access Private (Admin)
 */
export const updateEventVoteController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request body
  const { error, value } = updateEventVoteSchema.validate(req.body);
  if (error) {
    throw new AppError(`Validation error: ${error.details[0].message}`, 400);
  }

  const result = await updateEventVote(id, value);

  logger.info(`Event vote updated: ${id}`);
  return ApiResponse.success(res, result, SUCCESS_MESSAGES.UPDATED);
});

/**
 * Delete event vote (soft delete)
 * @route DELETE /api/event-votes/:id
 * @access Private (Admin)
 */
export const deleteEventVoteController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteEventVote(id);

  logger.info(`Event vote soft deleted: ${id}`);
  return ApiResponse.success(res, null, SUCCESS_MESSAGES.DELETED);
});

/**
 * Get event votes by event ID
 * @route GET /api/event-votes/event/:eventId
 * @access Private (Admin, Staff)
 */
export const getEventVotesByEventIdController = asyncHandler(
  async (req, res) => {
    const { eventId } = req.params;
    const { limit } = req.query;

    const eventVotes = await getEventVotesByEventId(eventId, limit);

    logger.info(
      `Retrieved ${eventVotes.length} event votes for event: ${eventId}`
    );
    return ApiResponse.success(
      res,
      eventVotes,
      "Event votes by event retrieved successfully"
    );
  }
);

/**
 * Get event votes by user ID
 * @route GET /api/event-votes/user/:userId
 * @access Private (Admin, Staff, Owner)
 */
export const getEventVotesByUserIdController = asyncHandler(
  async (req, res) => {
    const { userId } = req.params;
    const { limit } = req.query;

    const eventVotes = await getEventVotesByUserId(userId, limit);

    logger.info(
      `Retrieved ${eventVotes.length} event votes for user: ${userId}`
    );
    return ApiResponse.success(
      res,
      eventVotes,
      "Event votes by user retrieved successfully"
    );
  }
);

/**
 * Get event vote statistics
 * @route GET /api/event-votes/statistics/summary
 * @access Private (Admin, Staff)
 */
export const getEventVoteStatisticsController = asyncHandler(
  async (req, res) => {
    const stats = await getEventVoteStatistics();

    logger.info("Retrieved event vote statistics");
    return ApiResponse.success(res, stats, "Statistics retrieved successfully");
  }
);
