import Joi from "joi";

/**
 * Validation schema for creating a new booking
 */
export const createBookingSchema = Joi.object({
  UserId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
    "any.required": "User ID is required",
  }),

  BookingDate: Joi.date().iso().required().messages({
    "date.base": "Booking date must be a valid date",
    "date.iso": "Booking date must be in ISO format",
    "any.required": "Booking date is required",
  }),

  CheckinDate: Joi.date().iso().required().messages({
    "date.base": "Check-in date must be a valid date",
    "date.iso": "Check-in date must be in ISO format",
    "any.required": "Check-in date is required",
  }),

  CheckoutDate: Joi.date()
    .iso()
    .min(Joi.ref("CheckinDate"))
    .required()
    .messages({
      "date.base": "Check-out date must be a valid date",
      "date.iso": "Check-out date must be in ISO format",
      "date.min": "Check-out date must be on or after check-in date",
      "any.required": "Check-out date is required",
    }),

  Note: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note cannot exceed 500 characters",
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
      "Cancelled",
      "Completed",
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
        "Status must be one of: Pending, Confirmed, Cancelled, Completed, Paid, Unpaid",
    }),

  listBookingVotesDetails: Joi.array()
    .items(
      Joi.object({
        RoomId: Joi.number().integer().positive().required(),
        RoomPrice: Joi.alternatives()
          .try(
            Joi.number().positive(),
            Joi.string()
              .pattern(/^\d+(\.\d{1,2})?$/)
              .custom((value) => parseFloat(value))
          )
          .required(),
        Note: Joi.string().max(255).allow("").optional(),
      })
    )
    .optional()
    .messages({
      "array.base": "Booking details must be an array",
    }),
});

/**
 * Validation schema for updating a booking
 */
export const updateBookingSchema = Joi.object({
  UserId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be positive",
  }),

  BookingDate: Joi.date().iso().optional().messages({
    "date.base": "Booking date must be a valid date",
    "date.iso": "Booking date must be in ISO format",
  }),

  CheckinDate: Joi.date().iso().optional().messages({
    "date.base": "Check-in date must be a valid date",
    "date.iso": "Check-in date must be in ISO format",
  }),

  CheckoutDate: Joi.date().iso().optional().messages({
    "date.base": "Check-out date must be a valid date",
    "date.iso": "Check-out date must be in ISO format",
  }),

  Note: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Note must be a string",
    "string.max": "Note cannot exceed 500 characters",
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

  Status: Joi.string().optional().messages({
    "string.base": "Status must be a string",
  }),

  listBookingVotesDetails: Joi.array()
    .items(
      Joi.object({
        BookingVotesDetailId: Joi.number().integer().positive().optional(),
        RoomId: Joi.number().integer().positive().required(),
        RoomPrice: Joi.alternatives()
          .try(
            Joi.number().positive(),
            Joi.string()
              .pattern(/^\d+(\.\d{1,2})?$/)
              .custom((value) => parseFloat(value))
          )
          .required(),
        Note: Joi.string().max(255).allow("").optional(),
        Deleted: Joi.boolean().optional(),
      })
    )
    .optional()
    .messages({
      "array.base": "Booking details must be an array",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

/**
 * Validation schema for updating booking status
 */
export const updateBookingStatusSchema = Joi.object({
  status: Joi.string().required().messages({
    "string.base": "Status must be a string",
    "any.required": "Status is required",
  }),
});
