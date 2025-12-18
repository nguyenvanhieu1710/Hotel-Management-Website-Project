import Joi from "joi";

export const userSchema = Joi.object({
  UserId: Joi.number().integer().optional(),
  IdentificationNumber: Joi.string().required(),
  UserName: Joi.string().required(),
  UserImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
  Deleted: Joi.boolean().optional(),
});

export const createUserSchema = Joi.object({
  IdentificationNumber: Joi.string().required(),
  UserName: Joi.string().required(),
  UserImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().required(),
  Gender: Joi.string().required(),
  PhoneNumber: Joi.string().required(),
  Address: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  IdentificationNumber: Joi.string().optional(),
  UserName: Joi.string().optional(),
  UserImage: Joi.string().optional().allow(""),
  DateOfBirth: Joi.date().optional(),
  Gender: Joi.string().optional(),
  PhoneNumber: Joi.string().optional(),
  Address: Joi.string().optional(),
}).min(1); // At least one field must be provided
