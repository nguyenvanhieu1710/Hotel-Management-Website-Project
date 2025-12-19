import Joi from "joi";

/**
 * Validation schema for creating a new evaluation
 */
export const createEvaluationSchema = Joi.object({
  UserId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  RoomId: Joi.number().integer().positive().required().messages({
    "number.base": "Room ID must be a number",
    "number.integer": "Room ID must be an integer",
    "number.positive": "Room ID must be positive",
    "any.required": "Room ID is required",
  }),

  Rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
    "any.required": "Rating is required",
  }),

  Comment: Joi.string().min(1).max(1000).required().messages({
    "string.base": "Comment must be a string",
    "string.min": "Comment cannot be empty",
    "string.max": "Comment cannot exceed 1000 characters",
    "any.required": "Comment is required",
  }),

  Status: Joi.string()
    .valid("Draft", "Under Review", "Approved", "Rejected", "Published", "")
    .default("Draft")
    .custom((value) => {
      if (value === "" || !value) {
        return "Draft";
      }
      return value;
    })
    .messages({
      "string.base": "Status must be a string",
      "any.only":
        "Status must be one of: Draft, Under Review, Approved, Rejected, Published",
    }),
});

/**
 * Validation schema for updating an evaluation
 */
export const updateEvaluationSchema = Joi.object({
  UserId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
  }),

  RoomId: Joi.number().integer().positive().optional().messages({
    "number.base": "Room ID must be a number",
    "number.integer": "Room ID must be an integer",
    "number.positive": "Room ID must be positive",
  }),

  Rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must be at most 5",
  }),

  Comment: Joi.string().min(1).max(1000).optional().messages({
    "string.base": "Comment must be a string",
    "string.min": "Comment cannot be empty",
    "string.max": "Comment cannot exceed 1000 characters",
  }),

  Status: Joi.string()
    .valid("Draft", "Under Review", "Approved", "Rejected", "Published")
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only":
        "Status must be one of: Draft, Under Review, Approved, Rejected, Published",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Legacy schema for backward compatibility
export const evaluationSchema = createEvaluationSchema;
