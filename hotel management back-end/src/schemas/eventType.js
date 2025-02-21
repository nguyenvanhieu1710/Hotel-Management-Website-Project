import Joi from "joi";

export const eventTypeSchema = Joi.object({
  EventTypeId: Joi.number().required(),
  EventTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
