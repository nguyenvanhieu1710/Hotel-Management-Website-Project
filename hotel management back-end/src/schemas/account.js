import Joi from "joi";

export const accountSchema = Joi.object({
  accountId: Joi.number().integer().required(),
  accountName: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().required(),
  status: Joi.string().required(),
  creationDate: Joi.date().required(),
  deleted: Joi.boolean().required(),
});

export const loginSchema = Joi.object({
  accountName: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  accountName: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});
