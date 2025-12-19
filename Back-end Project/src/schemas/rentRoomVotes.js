import Joi from "joi";

/**
 * Validation schema for creating a new rent room vote
 */
export const createRentRoomVoteSchema = Joi.object({
  UserId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  ActualCheckinDate: Joi.date().iso().required().messages({
    "date.base": "Actual check-in date must be a valid date",
    "date.iso": "Actual check-in date must be in ISO format",
    "any.required": "Actual check-in date is required",
  }),

  ActualCheckoutDate: Joi.date()
    .iso()
    .min(Joi.ref("ActualCheckinDate"))
    .required()
    .messages({
      "date.base": "Actual check-out date must be a valid date",
      "date.iso": "Actual check-out date must be in ISO format",
      "date.min": "Actual check-out date must be on or after check-in date",
      "any.required": "Actual check-out date is required",
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
    .valid(
      "Pending",
      "Confirmed",
      "Checked-in",
      "In-house",
      "Checked-out",
      "Cancelled",
      "Paid",
      "Unpaid",
      ""
    )
    .default("Pending")
    .custom((value) => {
      if (value === "" || !value) {
        return "Pending";
      }
      return value;
    })
    .messages({
      "string.base": "Status must be a string",
      "any.only":
        "Status must be one of: Pending, Confirmed, Checked-in, In-house, Checked-out, Cancelled, Paid, Unpaid",
    }),

  Note: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note cannot exceed 500 characters",
  }),
});

/**
 * Validation schema for updating a rent room vote
 */
export const updateRentRoomVoteSchema = Joi.object({
  UserId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
  }),

  ActualCheckinDate: Joi.date().iso().optional().messages({
    "date.base": "Actual check-in date must be a valid date",
    "date.iso": "Actual check-in date must be in ISO format",
  }),

  ActualCheckoutDate: Joi.date().iso().optional().messages({
    "date.base": "Actual check-out date must be a valid date",
    "date.iso": "Actual check-out date must be in ISO format",
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
    .valid(
      "Pending",
      "Confirmed",
      "Checked-in",
      "In-house",
      "Checked-out",
      "Cancelled",
      "Paid",
      "Unpaid"
    )
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only":
        "Status must be one of: Pending, Confirmed, Checked-in, In-house, Checked-out, Cancelled, Paid, Unpaid",
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
export const rentRoomVotesSchema = createRentRoomVoteSchema;
