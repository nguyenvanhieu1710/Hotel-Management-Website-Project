import Joi from "joi";

/**
 * Validation schema for creating a new bill
 */
export const createBillSchema = Joi.object({
  UserId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  CreationDate: Joi.date().iso().required().messages({
    "date.base": "Creation date must be a valid date",
    "date.iso": "Creation date must be in ISO format",
    "any.required": "Creation date is required",
  }),

  TotalAmount: Joi.alternatives()
    .try(
      Joi.number().positive(),
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/)
        .custom((value) => parseFloat(value))
    )
    .required()
    .messages({
      "alternatives.match": "Total amount must be a positive number",
      "any.required": "Total amount is required",
    }),

  Status: Joi.string()
    .valid("Unpaid", "Paid", "Pending", "Cancelled", "")
    .default("Unpaid")
    .custom((value) => {
      if (value === "" || !value) {
        return "Unpaid";
      }
      return value;
    })
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: Unpaid, Paid, Pending, Cancelled",
    }),

  Note: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note cannot exceed 500 characters",
  }),
});

/**
 * Validation schema for updating a bill
 */
export const updateBillSchema = Joi.object({
  UserId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
  }),

  CreationDate: Joi.date().iso().optional().messages({
    "date.base": "Creation date must be a valid date",
    "date.iso": "Creation date must be in ISO format",
  }),

  TotalAmount: Joi.alternatives()
    .try(
      Joi.number().positive(),
      Joi.string()
        .pattern(/^\d+(\.\d{1,2})?$/)
        .custom((value) => parseFloat(value))
    )
    .optional()
    .messages({
      "alternatives.match": "Total amount must be a positive number",
    }),

  Status: Joi.string()
    .valid("Unpaid", "Paid", "Pending", "Cancelled")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of: Unpaid, Paid, Pending, Cancelled",
    }),

  Note: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note cannot exceed 500 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Legacy schema for backward compatibility
export const billSchema = createBillSchema;
