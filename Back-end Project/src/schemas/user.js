import Joi from "joi";

export const userSchema = Joi.object({
  UserId: Joi.number().integer().required(),
  IdentificationNumber: Joi.string().required(),
  UserName: Joi.string().required(),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
