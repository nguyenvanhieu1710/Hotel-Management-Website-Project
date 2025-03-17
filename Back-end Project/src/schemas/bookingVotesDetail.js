import Joi from "joi";

export const bookingVotesDetailSchema = Joi.object({
  BookingVotesDetailId: Joi.number().required(),
  BookingVotesId: Joi.number().required(),
  RoomId: Joi.number().required(),
  Note: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
