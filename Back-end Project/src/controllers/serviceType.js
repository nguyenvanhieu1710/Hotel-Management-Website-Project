import serviceTypeService from "../services/serviceType.service.js";
import {
  createServiceTypeSchema,
  updateServiceTypeSchema,
} from "../schemas/serviceType.js";
import ApiResponse from "../utils/response.js";
import { HTTP_STATUS } from "../constants/index.js";
import logger from "../utils/logger.js";

/**
 * Get all service types with pagination
 */
export const getAllServiceType = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const filters = {};
    if (search) {
      filters.search = search;
    }

    const result = await serviceTypeService.getAllServiceTypes(
      page,
      limit,
      filters
    );

    logger.info(
      `Retrieved service types - Page: ${page}, Limit: ${limit}, Total: ${result.pagination.total}`
    );

    return ApiResponse.paginated(
      res,
      result.serviceTypes,
      result.pagination,
      "Service types retrieved successfully"
    );
  } catch (error) {
    logger.error("Error in getAllServiceType:", error);
    return ApiResponse.error(
      res,
      error.message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Get service type by ID
 */
export const getServiceTypeById = async (req, res) => {
  try {
    const serviceTypeId = parseInt(req.params.id);

    if (!serviceTypeId || isNaN(serviceTypeId)) {
      return ApiResponse.error(
        res,
        "Invalid service type ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceType = await serviceTypeService.getServiceTypeById(
      serviceTypeId
    );

    logger.info(`Retrieved service type with ID: ${serviceTypeId}`);
    return ApiResponse.success(
      res,
      serviceType,
      "Service type retrieved successfully"
    );
  } catch (error) {
    logger.error("Error in getServiceTypeById:", error);
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

/**
 * Create new service type
 */
export const createServiceType = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createServiceTypeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ApiResponse.error(
        res,
        errorMessages.join(", "),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceType = await serviceTypeService.createServiceType(value);

    logger.info(
      `Service type created successfully with ID: ${serviceType.ServiceTypeId}`
    );
    return ApiResponse.created(
      res,
      serviceType,
      "Service type created successfully"
    );
  } catch (error) {
    logger.error("Error in createServiceType:", error);
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

/**
 * Update service type
 */
export const updateServiceType = async (req, res) => {
  try {
    const serviceTypeId = parseInt(req.params.id);

    if (!serviceTypeId || isNaN(serviceTypeId)) {
      return ApiResponse.error(
        res,
        "Invalid service type ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate request body
    const { error, value } = updateServiceTypeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ApiResponse.error(
        res,
        errorMessages.join(", "),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const serviceType = await serviceTypeService.updateServiceType(
      serviceTypeId,
      value
    );

    logger.info(`Service type updated successfully with ID: ${serviceTypeId}`);
    return ApiResponse.success(
      res,
      serviceType,
      "Service type updated successfully"
    );
  } catch (error) {
    logger.error("Error in updateServiceType:", error);
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

/**
 * Delete service type (soft delete)
 */
export const deleteServiceType = async (req, res) => {
  try {
    const serviceTypeId = parseInt(req.params.id);

    if (!serviceTypeId || isNaN(serviceTypeId)) {
      return ApiResponse.error(
        res,
        "Invalid service type ID",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    await serviceTypeService.deleteServiceType(serviceTypeId);

    logger.info(`Service type deleted successfully with ID: ${serviceTypeId}`);
    return ApiResponse.success(res, null, "Service type deleted successfully");
  } catch (error) {
    logger.error("Error in deleteServiceType:", error);
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
