import Joi from "joi";

// Schema for creating service
export const createServiceSchema = Joi.object({
  ServiceName: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Service name is required",
    "string.min": "Service name must be at least 1 character",
    "string.max": "Service name must not exceed 100 characters",
  }),
  ServiceTypeId: Joi.number().integer().positive().required().messages({
    "number.base": "Service type ID must be a number",
    "number.positive": "Service type ID must be positive",
    "any.required": "Service type is required",
  }),
  ServiceImage: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Service image URL must not exceed 500 characters",
  }),
  Price: Joi.alternatives()
    .try(
      Joi.number().positive(),
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/)
        .custom((value, helpers) => {
          const numValue = parseFloat(value);
          if (numValue <= 0) {
            return helpers.error("number.positive");
          }
          return numValue;
        })
    )
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be positive",
      "string.pattern.base": "Price must be a valid number format",
      "any.required": "Price is required",
    }),
  Description: Joi.string().allow("").max(1000).optional().messages({
    "string.max": "Description must not exceed 1000 characters",
  }),
});

// Schema for updating service
export const updateServiceSchema = Joi.object({
  ServiceName: Joi.string().min(1).max(100).optional().messages({
    "string.empty": "Service name cannot be empty",
    "string.min": "Service name must be at least 1 character",
    "string.max": "Service name must not exceed 100 characters",
  }),
  ServiceTypeId: Joi.number().integer().positive().optional().messages({
    "number.base": "Service type ID must be a number",
    "number.positive": "Service type ID must be positive",
  }),
  ServiceImage: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Service image URL must not exceed 500 characters",
  }),
  Price: Joi.alternatives()
    .try(
      Joi.number().positive(),
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/)
        .custom((value, helpers) => {
          const numValue = parseFloat(value);
          if (numValue <= 0) {
            return helpers.error("number.positive");
          }
          return numValue;
        })
    )
    .optional()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be positive",
      "string.pattern.base": "Price must be a valid number format",
    }),
  Description: Joi.string().allow("").max(1000).optional().messages({
    "string.max": "Description must not exceed 1000 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Legacy schema for backward compatibility
export const serviceSchema = Joi.object({
  ServiceId: Joi.number().required(),
  ServiceName: Joi.string().required(),
  ServiceTypeId: Joi.number().required(),
  ServiceImage: Joi.string().required(),
  Price: Joi.number().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
