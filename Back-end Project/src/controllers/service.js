import serviceService from "../services/service.service.js";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../schemas/service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_MESSAGES, PAGINATION } from "../constants/index.js";

/**
 * Get All Services Controller
 * @route GET /api/services
 * @access Public
 */
export const getService = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  // Extract filters from query
  const filters = {
    serviceTypeId: req.query.serviceTypeId,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    search: req.query.search,
  };

  const result = await serviceService.getAllServices(page, limit, filters);

  return ApiResponse.paginated(
    res,
    result.services,
    result.pagination,
    "Services retrieved successfully"
  );
});

/**
 * Get Service By ID Controller
 * @route GET /api/services/:id
 * @access Public
 */
export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const service = await serviceService.getServiceById(id);

  return ApiResponse.success(res, service, "Service retrieved successfully");
});

/**
 * Get Services By Type Controller
 * @route GET /api/services/type/:typeId
 * @access Public
 */
export const getServicesByType = asyncHandler(async (req, res) => {
  const { typeId } = req.params;

  const services = await serviceService.getServicesByType(typeId);

  return ApiResponse.success(res, services, "Services retrieved successfully");
});

/**
 * Search Services Controller
 * @route GET /api/services/search
 * @access Public
 */
export const searchServices = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new AppError("Search term is required", HTTP_STATUS.BAD_REQUEST);
  }

  const limit = parseInt(req.query.limit) || 20;
  const services = await serviceService.searchServices(q, limit);

  return ApiResponse.success(
    res,
    services,
    "Search results retrieved successfully"
  );
});

/**
 * Get Popular Services Controller
 * @route GET /api/services/popular
 * @access Public
 */
export const getPopularServices = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const services = await serviceService.getPopularServices(limit);

  return ApiResponse.success(
    res,
    services,
    "Popular services retrieved successfully"
  );
});

/**
 * Create Service Controller
 * @route POST /api/services
 * @access Private (Admin)
 */
export const createService = asyncHandler(async (req, res) => {
  // Validate request data
  const { error, value } = createServiceSchema.validate(req.body, {
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

  const result = await serviceService.createService(value);

  return ApiResponse.created(res, result, "Service created successfully");
});

/**
 * Update Service Controller
 * @route PUT /api/services/:id
 * @access Private (Admin)
 */
export const updateService = asyncHandler(async (req, res) => {
  const serviceId = parseInt(req.params.id);

  if (!serviceId || isNaN(serviceId)) {
    return ApiResponse.error(
      res,
      "Invalid service ID",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Validate request data
  const { error, value } = updateServiceSchema.validate(req.body, {
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

  const result = await serviceService.updateService(serviceId, value);

  return ApiResponse.success(res, result, "Service updated successfully");
});

/**
 * Delete Service Controller
 * @route DELETE /api/services/:id
 * @access Private (Admin)
 */
export const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await serviceService.deleteService(id);

  return ApiResponse.success(res, null, result.message);
});

/**
 * Get Service Statistics Controller
 * @route GET /api/services/statistics
 * @access Private (Admin)
 */
export const getServiceStatistics = asyncHandler(async (req, res) => {
  const statistics = await serviceService.getServiceStatistics();

  return ApiResponse.success(
    res,
    statistics,
    "Service statistics retrieved successfully"
  );
});

/**
 * Get Services By Price Range Controller
 * @route GET /api/services/price-range
 * @access Public
 */
export const getServicesByPriceRange = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  if (!minPrice || !maxPrice) {
    throw new AppError(
      "Min and max price are required",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const services = await serviceService.getServicesByPriceRange(
    parseFloat(minPrice),
    parseFloat(maxPrice)
  );

  return ApiResponse.success(res, services, "Services retrieved successfully");
});

export default {
  getService,
  getServiceById,
  getServicesByType,
  searchServices,
  getPopularServices,
  createService,
  updateService,
  deleteService,
  getServiceStatistics,
  getServicesByPriceRange,
};
