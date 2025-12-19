import Joi from "joi";

// Schema for creating new event
export const createEventSchema = Joi.object({
  EventName: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Event Name is required",
    "string.min": "Event Name must be at least 1 character",
    "string.max": "Event Name must not exceed 200 characters",
    "any.required": "Event Name is required",
  }),
  EventTypeId: Joi.number().integer().positive().required().messages({
    "number.base": "Event Type ID must be a number",
    "number.integer": "Event Type ID must be an integer",
    "number.positive": "Event Type ID must be positive",
    "any.required": "Event Type is required",
  }),
  EventImage: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Event Image must be a valid URL",
  }),
  OrganizationDay: Joi.date().required().messages({
    "date.base": "Organization Day must be a valid date",
    "any.required": "Organization Day is required",
  }),
  StartTime: Joi.date().required().messages({
    "date.base": "Start Time must be a valid datetime",
    "any.required": "Start Time is required",
  }),
  EndTime: Joi.date().required().messages({
    "date.base": "End Time must be a valid datetime",
    "any.required": "End Time is required",
  }),
  OrganizationLocation: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      "string.empty": "Organization Location is required",
      "string.min": "Organization Location must be at least 1 character",
      "string.max": "Organization Location must not exceed 500 characters",
      "any.required": "Organization Location is required",
    }),
  Price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  Status: Joi.string()
    .valid("Active", "Inactive", "Cancelled", "Completed")
    .default("Active")
    .messages({
      "any.only":
        "Status must be one of: Active, Inactive, Cancelled, Completed",
    }),
  Description: Joi.string().trim().min(1).max(1000).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 1 character",
    "string.max": "Description must not exceed 1000 characters",
    "any.required": "Description is required",
  }),
});

// Schema for updating event
export const updateEventSchema = Joi.object({
  EventName: Joi.string().trim().min(1).max(200).optional().messages({
    "string.empty": "Event Name cannot be empty",
    "string.min": "Event Name must be at least 1 character",
    "string.max": "Event Name must not exceed 200 characters",
  }),
  EventTypeId: Joi.number().integer().positive().optional().messages({
    "number.base": "Event Type ID must be a number",
    "number.integer": "Event Type ID must be an integer",
    "number.positive": "Event Type ID must be positive",
  }),
  EventImage: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Event Image must be a valid URL",
  }),
  OrganizationDay: Joi.date().optional().messages({
    "date.base": "Organization Day must be a valid date",
  }),
  StartTime: Joi.date().optional().messages({
    "date.base": "Start Time must be a valid datetime",
  }),
  EndTime: Joi.date().optional().messages({
    "date.base": "End Time must be a valid datetime",
  }),
  OrganizationLocation: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .optional()
    .messages({
      "string.empty": "Organization Location cannot be empty",
      "string.min": "Organization Location must be at least 1 character",
      "string.max": "Organization Location must not exceed 500 characters",
    }),
  Price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
  Status: Joi.string()
    .valid("Active", "Inactive", "Cancelled", "Completed")
    .optional()
    .messages({
      "any.only":
        "Status must be one of: Active, Inactive, Cancelled, Completed",
    }),
  Description: Joi.string().trim().min(1).max(1000).optional().messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description must be at least 1 character",
    "string.max": "Description must not exceed 1000 characters",
  }),
});

// Legacy schema for backward compatibility
export const eventSchema = Joi.object({
  EventId: Joi.number().optional(),
  EventName: Joi.string().required(),
  EventTypeId: Joi.number().required(),
  EventImage: Joi.string().required(),
  OrganizationDay: Joi.date().required(),
  StartTime: Joi.date().required(),
  EndTime: Joi.date().required(),
  OrganizationLocation: Joi.string().required(),
  Price: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
