import Joi from "joi";

export const rentRoomVotesDetailSchema = Joi.object({
  RentRoomVotesDetailId: Joi.number().required(),
  RentRoomVotesId: Joi.number().required(),
  RoomId: Joi.number().required(),
  ServiceVotesId: Joi.number().required(),
  TotalCostOfThisRoom: Joi.number().required(),
  Note: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
