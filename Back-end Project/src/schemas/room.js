import Joi from "joi";

export const roomSchema = Joi.object({
  RoomId: Joi.number().required(),
  RoomImage: Joi.string().required(),
  RoomTypeId: Joi.number().required(),
  Price: Joi.number().required(),
  NumberOfFloor: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
