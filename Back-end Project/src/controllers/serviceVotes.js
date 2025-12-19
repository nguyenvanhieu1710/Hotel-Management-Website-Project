import serviceVotesService from "../services/serviceVotes.service.js";
import ApiResponse from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

export const getAllServiceVotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const serviceId = req.query.serviceId;
    const userId = req.query.userId;

    const filters = {};
    if (serviceId) filters.serviceId = serviceId;
    if (userId) filters.userId = userId;

    const result = await serviceVotesService.getAllServiceVotes(
      page,
      limit,
      filters
    );

    logger.info(
      `Retrieved service votes - Page: ${page}, Limit: ${limit}, Total: ${result.pagination.total}`
    );

    return ApiResponse.paginated(
      res,
      result.serviceVotes,
      result.pagination,
      "Service votes retrieved successfully"
    );
  } catch (error) {
    logger.error("Error in getAllServiceVotes:", error);
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const getServiceVotesById = async (req, res) => {
  try {
    const serviceVotesId = parseInt(req.params.id);

    if (!serviceVotesId || isNaN(serviceVotesId)) {
      return ApiResponse.error(
        res,
        "Invalid service votes ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceVotes = await serviceVotesService.getServiceVotesById(
      serviceVotesId
    );

    logger.info(`Retrieved service votes with ID: ${serviceVotesId}`);
    return ApiResponse.success(
      res,
      serviceVotes,
      "Service votes retrieved successfully"
    );
  } catch (error) {
    logger.error("Error in getServiceVotesById:", error);
    if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const createServiceVotes = async (req, res) => {
  try {
    const { ServiceId, UserId, Quantity, TotalAmount } = req.body;

    // Validate required fields
    if (!ServiceId || !UserId || !Quantity) {
      return ApiResponse.error(
        res,
        "ServiceId, UserId, and Quantity are required",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceVotes = await serviceVotesService.createServiceVotes({
      ServiceId,
      UserId,
      Quantity,
      TotalAmount,
    });

    logger.info(
      `Service votes created successfully with ID: ${serviceVotes.ServiceVotesId}`
    );
    return ApiResponse.created(
      res,
      serviceVotes,
      "Service votes created successfully"
    );
  } catch (error) {
    logger.error("Error in createServiceVotes:", error);
    if (error.statusCode === HTTP_STATUS.BAD_REQUEST) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateServiceVotes = async (req, res) => {
  try {
    const serviceVotesId = parseInt(req.params.id);

    if (!serviceVotesId || isNaN(serviceVotesId)) {
      return ApiResponse.error(
        res,
        "Invalid service votes ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceVotes = await serviceVotesService.updateServiceVotes(
      serviceVotesId,
      req.body
    );

    logger.info(
      `Service votes updated successfully with ID: ${serviceVotesId}`
    );
    return ApiResponse.success(
      res,
      serviceVotes,
      "Service votes updated successfully"
    );
  } catch (error) {
    logger.error("Error in updateServiceVotes:", error);
    if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    if (error.statusCode === HTTP_STATUS.BAD_REQUEST) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteServiceVotes = async (req, res) => {
  try {
    const serviceVotesId = parseInt(req.params.id);

    if (!serviceVotesId || isNaN(serviceVotesId)) {
      return ApiResponse.error(
        res,
        "Invalid service votes ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await serviceVotesService.deleteServiceVotes(serviceVotesId);

    logger.info(
      `Service votes deleted successfully with ID: ${serviceVotesId}`
    );
    return ApiResponse.success(res, null, "Service votes deleted successfully");
  } catch (error) {
    logger.error("Error in deleteServiceVotes:", error);
    if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
      return ApiResponse.error(res, error.message, HTTP_STATUS.NOT_FOUND);
    }
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};
