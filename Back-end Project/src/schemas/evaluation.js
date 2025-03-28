import Joi from "joi";

export const evaluationSchema = Joi.object({
  EvaluationId: Joi.number().optional(),
  UserId: Joi.number().required(),
  RoomId: Joi.number().required(),
  Rating: Joi.number().required(),
  Comment: Joi.string().required(),
  Status: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
