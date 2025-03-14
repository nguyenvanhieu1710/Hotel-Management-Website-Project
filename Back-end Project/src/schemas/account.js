import Joi from "joi";

export const accountSchema = Joi.object({
  AccountId: Joi.number().integer().required(),
  AccountName: Joi.string().required(),
  Password: Joi.string().required(),
  Role: Joi.string().required(),
  Email: Joi.string().required(),
  Status: Joi.string().required(),
  CreationDate: Joi.date().required(),
  Deleted: Joi.boolean().required(),
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
