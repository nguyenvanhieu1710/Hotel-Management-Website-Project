import Joi from "joi";

export const billSchema = Joi.object({
  BillId: Joi.number().required(),
  UserId: Joi.number().required(),
  StaffId: Joi.number().required(),
  CreationDate: Joi.date().required(),
  TotalAmount: Joi.number().required(),
  Status: Joi.string().required(),
  Note: Joi.string().required(),
  Deleted: Joi.boolean().required(),
});
