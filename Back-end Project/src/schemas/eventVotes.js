import Joi from "joi";

// Schema for creating new event vote
export const createEventVoteSchema = Joi.object({
  EventId: Joi.number().integer().positive().required().messages({
    "number.base": "Event ID must be a number",
    "number.integer": "Event ID must be an integer",
    "number.positive": "Event ID must be positive",
    "any.required": "Event is required",
  }),
  UserId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User is required",
  }),
  TotalAmount: Joi.number().positive().precision(2).required().messages({
    "number.base": "Total Amount must be a number",
    "number.positive": "Total Amount must be greater than 0",
    "any.required": "Total Amount is required",
  }),
});

// Schema for updating event vote
export const updateEventVoteSchema = Joi.object({
  EventId: Joi.number().integer().positive().optional().messages({
    "number.base": "Event ID must be a number",
    "number.integer": "Event ID must be an integer",
    "number.positive": "Event ID must be positive",
  }),
  UserId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
  }),
  TotalAmount: Joi.number().positive().precision(2).optional().messages({
    "number.base": "Total Amount must be a number",
    "number.positive": "Total Amount must be greater than 0",
  }),
});

// Legacy schema for backward compatibility
export const eventVotesSchema = Joi.object({
  EventVotesId: Joi.number().required(),
  EventId: Joi.number().required(),
  UserId: Joi.number().required(),
  TotalAmount: Joi.number().required(),
  Deleted: Joi.boolean().required(),
});
