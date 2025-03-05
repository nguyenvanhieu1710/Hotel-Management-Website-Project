import { Joi } from "joi";

export const deviceTypeSchema = Joi.object({
  DeviceTypeId: Joi.number().required(),
  DeviceTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
