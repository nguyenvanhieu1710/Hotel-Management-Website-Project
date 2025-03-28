import Joi from "joi";

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
