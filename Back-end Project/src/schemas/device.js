import Joi from "joi";

export const deviceSchema = Joi.object({
  DeviceId: Joi.number().optional(),
  DeviceName: Joi.string().required(),
  DeviceTypeId: Joi.number().required(),
  RoomId: Joi.number().required(),
  DeviceImage: Joi.string().optional().allow(""),
  Price: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().optional(),
});

export const createDeviceSchema = Joi.object({
  DeviceName: Joi.string().required(),
  DeviceTypeId: Joi.number().required(),
  RoomId: Joi.number().required(),
  DeviceImage: Joi.string().optional().allow(""),
  Price: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
});

export const updateDeviceSchema = Joi.object({
  DeviceId: Joi.number().optional(), // Allow but ignore
  DeviceName: Joi.string().optional(),
  DeviceTypeId: Joi.number().optional(),
  RoomId: Joi.number().optional(),
  DeviceImage: Joi.string().optional().allow(""),
  Price: Joi.number().optional(),
  Status: Joi.string().optional(),
  Description: Joi.string().optional(),
  Deleted: Joi.boolean().optional(), // Allow but ignore
}).min(1); // At least one field must be provided
