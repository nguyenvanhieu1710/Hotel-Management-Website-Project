import Joi from "joi";

export const eventVotesSchema = Joi.object({
  EventVotesId: Joi.number().required(),
  EventId: Joi.number().required(),
  UserId: Joi.number().required(),
  TotalAmount: Joi.number().required(),
  Deleted: Joi.boolean().required(),
});
