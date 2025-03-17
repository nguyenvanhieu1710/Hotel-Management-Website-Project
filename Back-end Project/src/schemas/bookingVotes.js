import Joi from "joi";

export const bookingVotesSchema = Joi.object({
  BookingVotesId: Joi.number().required(),
  UserId: Joi.number().required(),
  BookingDate: Joi.date().required(),
  CheckinDate: Joi.date().required(),
  CheckoutDate: Joi.date().required(),
  Note: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
