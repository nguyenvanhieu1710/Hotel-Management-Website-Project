import Joi from "joi";

export const deviceSchema = Joi.object({
  DeviceId: Joi.number().required(),
  DeviceName: Joi.string().required(),
  DeviceTypeId: Joi.number().required(),
  RoomId: Joi.number().required(),
  DeviceImage: Joi.string().required(),
  Price: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
