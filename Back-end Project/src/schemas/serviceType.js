import Joi from "joi";

export const serviceTypeSchema = Joi.object({
  ServiceTypeId: Joi.number().required(),
  ServiceTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
