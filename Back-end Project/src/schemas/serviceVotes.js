import Joi from "joi";

export const serviceVotesSchema = Joi.object({
  ServiceVotesId: Joi.number().required(),
  ServiceId: Joi.number().required(),
  Quantity: Joi.number().required(),
  TotalAmount: Joi.number().required(),
  Deleted: Joi.boolean().required(),
});
