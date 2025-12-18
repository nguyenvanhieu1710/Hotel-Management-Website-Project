import Joi from "joi";

export const roomSchema = Joi.object({
  RoomId: Joi.number().optional(),
  RoomTypeId: Joi.number().required(),
  RoomImage: Joi.string().optional().allow(""),
  Price: Joi.number().required(),
  NumberOfFloor: Joi.number().required(),
  MaximumNumberOfGuests: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  RoomArea: Joi.number().required(),
  Amenities: Joi.string().required(),
  RoomDetail: Joi.string().required(),
  Deleted: Joi.boolean().optional(),
});

export const createRoomSchema = Joi.object({
  RoomTypeId: Joi.number().required(),
  RoomImage: Joi.string().optional().allow(""),
  Price: Joi.number().required(),
  NumberOfFloor: Joi.number().required(),
  MaximumNumberOfGuests: Joi.number().required(),
  Status: Joi.string().required(),
  Description: Joi.string().required(),
  RoomArea: Joi.number().required(),
  Amenities: Joi.string().required(),
  RoomDetail: Joi.string().required(),
});

export const updateRoomSchema = Joi.object({
  RoomId: Joi.number().optional(), // Allow but ignore
  RoomTypeId: Joi.number().optional(),
  RoomImage: Joi.string().optional().allow(""),
  Price: Joi.number().optional(),
  NumberOfFloor: Joi.number().optional(),
  MaximumNumberOfGuests: Joi.number().optional(),
  Status: Joi.string().optional(),
  Description: Joi.string().optional(),
  RoomArea: Joi.number().optional(),
  Amenities: Joi.string().optional(),
  RoomDetail: Joi.string().optional(),
  Deleted: Joi.boolean().optional(), // Allow but ignore
}).min(1); // At least one field must be provided
