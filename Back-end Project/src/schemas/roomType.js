import Joi from "joi";

export const roomTypeSchema = Joi.object({
  RoomTypeId: Joi.number().required(),
  RoomTypeName: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
