import Joi from "joi";

export const roomSchema = Joi.object({
  RoomId: Joi.number().required(),
  RoomTypeId: Joi.number().required(),
  RoomImage: Joi.string().required(),
  Price: Joi.number().required(),
  NumberOfFloor: Joi.number().required(),
  MaximumNumberOfGuests: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  RoomArea: Joi.number().required(),
  Amenities: Joi.string().required(),
  RoomDetail: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
