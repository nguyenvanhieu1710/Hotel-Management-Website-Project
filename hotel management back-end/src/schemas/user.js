import Joi from "joi";

export const userSchema = Joi.object({
  userId: Joi.number().integer().required(),
  identificationNumber: Joi.string().required(),
  userName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  deleted: Joi.boolean().required(),
});
