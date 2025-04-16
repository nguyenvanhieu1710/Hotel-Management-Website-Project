import Joi from "joi";

export const bookingVotesSchema = Joi.object({
  BookingVotesId: Joi.number().required(),
  UserId: Joi.number().required(),
  BookingDate: Joi.date().required(),
  CheckinDate: Joi.date().required(),
  CheckoutDate: Joi.date().required(),
  Note: Joi.string().required(),
  TotalAmount: Joi.number().required(),
  Status: Joi.string().required(),
  Deleted: Joi.boolean().required(),
  listBookingVotesDetails: Joi.array()
    .items(
      Joi.object({
        BookingVotesDetailId: Joi.number().required(),
        BookingVotesId: Joi.number().required(),
        RoomId: Joi.number().required(),
        RoomPrice: Joi.number().required(),
        Note: Joi.string().required(),
        Deleted: Joi.boolean().required(),
      })
    )
    .required(),
});
