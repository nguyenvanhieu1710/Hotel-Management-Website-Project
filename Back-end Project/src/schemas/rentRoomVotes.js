import Joi from "joi";

export const rentRoomVotesSchema = Joi.object({
  RentRoomVotesId: Joi.number().required(),
  UserId: Joi.number().required(),
  ActualCheckinDate: Joi.date().required(),
  ActualCheckoutDate: Joi.date().required(),
  TotalAmount: Joi.number().required(),
  Status: Joi.string().required(),
  Note: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
