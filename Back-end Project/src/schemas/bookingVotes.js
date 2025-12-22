import Joi from "joi";

export const bookingVotesSchema = Joi.object({
  BookingVotesId: Joi.number().optional().allow(0), // Allow 0 for new records
  UserId: Joi.number().required(),
  BookingDate: Joi.date().required(),
  CheckinDate: Joi.date().required(),
  CheckoutDate: Joi.date().required(),
  Note: Joi.string().allow("").optional(), // Allow empty string
  TotalAmount: Joi.number().required(),
  Status: Joi.string().required(),
  Deleted: Joi.boolean().required(),
  listBookingVotesDetails: Joi.array()
    .items(
      Joi.object({
        BookingVotesDetailId: Joi.number().optional().allow(0), // Allow 0 for new records
        BookingVotesId: Joi.number().optional().allow(0), // Allow 0 for new records
        RoomId: Joi.number().required(),
        RoomPrice: Joi.number().required(),
        Note: Joi.string().allow("").optional(), // Allow empty string
        Deleted: Joi.boolean().required(),
      })
    )
    .required(),
});

// Create schema for new bookings (more lenient)
export const createBookingVotesSchema = Joi.object({
  UserId: Joi.number().required(),
  BookingDate: Joi.string().required(), // Accept string date format
  CheckinDate: Joi.string().required(), // Accept string date format
  CheckoutDate: Joi.string().required(), // Accept string date format
  Note: Joi.string().allow("").optional(),
  TotalAmount: Joi.number().required(),
  Status: Joi.string().optional().default("Pending"),
  listBookingVotesDetails: Joi.array()
    .items(
      Joi.object({
        RoomId: Joi.number().required(),
        RoomPrice: Joi.number().required(),
        Note: Joi.string().allow("").optional(),
      })
    )
    .required(),
});
