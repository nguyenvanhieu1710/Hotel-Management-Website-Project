import Joi from "joi";

// Schema for creating service type
export const createServiceTypeSchema = Joi.object({
  ServiceTypeName: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Service type name is required",
    "string.min": "Service type name must be at least 1 character",
    "string.max": "Service type name must not exceed 100 characters",
  }),
  Description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),
});

// Schema for updating service type
export const updateServiceTypeSchema = Joi.object({
  ServiceTypeName: Joi.string().min(1).max(100).optional().messages({
    "string.empty": "Service type name cannot be empty",
    "string.min": "Service type name must be at least 1 character",
    "string.max": "Service type name must not exceed 100 characters",
  }),
  Description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Legacy schema for backward compatibility
export const serviceTypeSchema = Joi.object({
  ServiceTypeId: Joi.number().required(),
  ServiceTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
