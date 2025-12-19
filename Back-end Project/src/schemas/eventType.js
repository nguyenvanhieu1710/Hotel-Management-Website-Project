import Joi from "joi";

// Schema for creating new event type
export const createEventTypeSchema = Joi.object({
  EventTypeName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Event Type Name is required",
    "string.min": "Event Type Name must be at least 1 character",
    "string.max": "Event Type Name must not exceed 100 characters",
    "any.required": "Event Type Name is required",
  }),
  Description: Joi.string().trim().min(1).max(500).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 1 character",
    "string.max": "Description must not exceed 500 characters",
    "any.required": "Description is required",
  }),
});

// Schema for updating event type
export const updateEventTypeSchema = Joi.object({
  EventTypeName: Joi.string().trim().min(1).max(100).optional().messages({
    "string.empty": "Event Type Name cannot be empty",
    "string.min": "Event Type Name must be at least 1 character",
    "string.max": "Event Type Name must not exceed 100 characters",
  }),
  Description: Joi.string().trim().min(1).max(500).optional().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 1 character",
    "string.max": "Description must not exceed 500 characters",
  }),
});

// Legacy schema for backward compatibility
export const eventTypeSchema = Joi.object({
  EventTypeId: Joi.number().required(),
  EventTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
